import {
  Box,
  type CssVarsTheme
} from '@mui/material'
import ListColumns from './list-columns/ListColumns'
import { useTheme } from '@emotion/react'
import type { IBoard, ICard, IColumn } from '../interfaceBoards'
import { mapOrder } from '~/common/utils/sorts'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DropAnimation,
  defaultDropAnimationSideEffects,
  closestCorners,
  type Active,
  type Over,
  type CollisionDetection,
  pointerWithin,
  getFirstCollision,
  type UniqueIdentifier
} from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './list-columns/columns/Column'
import CardItem from './list-columns/columns/list-cards/card/CardItem'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlacehoderCard } from '~/common/utils/formatter'

interface IBoardContentProps {
  board: IBoard
}

interface IMoveCardBetweenDifferentColumns {
  overColumn: IColumn,
  overCardId: number | string,
  active: Active,
  over: Over,
  activeColumn: IColumn,
  activeDraggingCardId: number | string,
  activeDraggingCardData: IColumn | ICard | any
}

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent(props: IBoardContentProps) {
  const { board } = props
  const theme = useTheme() as CssVarsTheme
  const [orderedColumns, setOrderedColumns] = useState<IColumn[]>([])
  const [activeDragItemId, setActiveDragItemId] = useState<string | number | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | number | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<IColumn | ICard | null>(null)
  const [oldColumsWhenDragCard, setOldColumsWhenDragCard] = useState<IColumn | null>(null)

  //điểm va trạm cuối cùng trước đó
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const findColumnByCardId = (cardId: string | number) => {
    return orderedColumns?.find((column: IColumn) => column.cards?.map((card: ICard) => card?._id)?.includes(cardId as string)) || null
  }

  const moveCardBetweenDifferentColumns = (propsMoveCardBetweenDifferentColumns: IMoveCardBetweenDifferentColumns) => {
    const {
      overColumn,
      overCardId,
      active,
      over,
      activeColumn,
      activeDraggingCardId,
      activeDraggingCardData
    } = propsMoveCardBetweenDifferentColumns

    setOrderedColumns((prevColumns: IColumn[]) => {
      //tim vi tri noi mà  activeCard sap dc tha ra
      const overCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
      const isBelowOverItem = active.rect?.current?.translated && active.rect?.current?.translated.top > over?.rect?.top + over?.rect?.height
      const modifier = isBelowOverItem ? 1 : 0
      const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      const nextColumns: IColumn[] = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      if (nextActiveColumn) {
        //xóa card ra khỏi column
        nextActiveColumn.cards = nextActiveColumn?.cards?.filter(c => c._id !== activeDraggingCardId)

        if (!isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlacehoderCard(nextActiveColumn)]
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map(c => c._id)
      }

      if (nextOverColumn) {
        //kiểm tra xem cardColumn đã có ở cái cb cho vào hay chưa , có rồi thì xóa nó đi
        //toSpliced gần giống như Splice nhưng nó sẽ trả về 1 mảng mới thay vì sửa trực tiếp mảng đang được gọi
        nextOverColumn.cards = nextOverColumn?.cards?.filter(c => c._id !== activeDraggingCardId)

        const rebuild_activeDraggingCardData: ICard = {
          ...activeDraggingCardData as ICard,
          columnId: nextOverColumn._id
        }

        nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        nextOverColumn.cards = nextOverColumn.cards.filter(c => !c.FE_PlacehoderCard)
        nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map(c => c._id)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event: DragEndEvent) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current as IColumn)

    //nếu là kéo card thì mới set
    if (event?.active?.data?.current?.columnId) {
      setOldColumsWhenDragCard(findColumnByCardId(event.active.data.current.columnId))
    }
  }

  //quá trình khi kéo thả 1 phần tử
  const handleDragOver = (event: DragEndEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns({
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !active) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumsWhenDragCard?._id !== overColumn._id) {
        moveCardBetweenDifferentColumns({
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        })
      } else {
        const oldCardIndex: number = oldColumsWhenDragCard?.cards.findIndex((item: ICard) => item?._id === activeDragItemId)
        const newCardIndex: number = overColumn?.cards.findIndex((item: ICard) => item?._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumsWhenDragCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns((prevColumns: IColumn[]) => {
          const nextColumns: IColumn[] = cloneDeep(prevColumns)
          const targetColumn: IColumn = nextColumns.find(c => c._id === overColumn._id) as IColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(c => c._id)

          return nextColumns
        })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      const oldColumnIndex: number = orderedColumns.findIndex((item: IColumn) => item?._id === active.id)
      const newColumnIndex: number = orderedColumns.findIndex((item: IColumn) => item?._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

      setOrderedColumns(dndOrderedColumns)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumsWhenDragCard(null)
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy: CollisionDetection = useCallback((args) => {
    //trường hợp kéo colums thì dùng thuật toán closestCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return closestCorners({ ...args })

    //tìm các điểm giao nhau va chạm vói con trỏ
    const pointerCollisions = pointerWithin(args)
    if (!pointerCollisions?.length) return []
    // const intersections = !!pointerCollisions?.length ? pointerCollisions : rectIntersection(args)

    let overId = getFirstCollision(pointerCollisions, 'id')

    if (overId) {
      const checkColum = orderedColumns.find(c => c._id === overId)
      if (checkColum) {
        overId = closestCorners({
          ...args,
          droppableContainers: args?.droppableContainers?.filter(container => (
            container.id === overId && checkColum?.cardOrderIds?.includes(container.id as string)
          ))
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType])

  useEffect(() => {
    setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
  }, [board])

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        className='w-full justify-between py-[10px]'
        sx={{
          height: theme.trello.boardContentHeight,
          bgcolor: theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData as IColumn} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <CardItem card={activeDragItemData as ICard} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent