import type { ICard, IColumn } from '~/pages/boards/interfaceBoards'

export const capitalizeFirstLetter = (val: string) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlacehoderCard = (column: IColumn) => {
  return {
    _id: `${column._id}-placehoder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlacehoderCard: true
  } as ICard
}