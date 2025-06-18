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
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './list-columns/columns/Column'
import CardItem from './list-columns/columns/list-cards/card/CardItem'

interface IBoardContentProps {
  board: IBoard
}

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD"
}

function BoardContent(props: IBoardContentProps) {
  const { board } = props
  const theme = useTheme() as CssVarsTheme
  const [orderedColumns, setOrderedColumns] = useState<IColumn[]>([])
  // const [activeDragItemId, setActiveDragItemId] = useState<string | number | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | number | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<IColumn | ICard | null>(null)

  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragStart = (event: DragEndEvent) => {
    // setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current as IColumn)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return
    if (active.id !== over.id) {
      const oldIndex: number = orderedColumns.findIndex((item: IColumn) => item?._id === active.id)
      const newIndex: number = orderedColumns.findIndex((item: IColumn) => item?._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(item => item._id)

      setOrderedColumns(dndOrderedColumns)
    }

    // setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  useEffect(() => {
    setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, "_id"))
  }, [board])

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Box
        className="w-full justify-between py-[10px]"
        sx={{
          height: theme.trello.boardContentHeight,
          bgcolor: theme.palette.mode === "dark" ? "#34495e" : "#1976d2"
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