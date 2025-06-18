export interface IAttachment {
  // Tùy chỉnh thêm nếu attachment sau này có dạng object thay vì string
  // id, name, url, type, etc.
  [key: string]: any
}

export interface ICard {
  _id: string
  boardId: string
  columnId: string
  title: string
  description?: string | null
  cover?: string | null
  memberIds: string[]
  comments: string[] // Hoặc có thể là object nếu sau này muốn đầy đủ thông tin
  attachments: (string | IAttachment)[]
}

export interface IColumn {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: ICard[]
}

export interface IBoard {
  _id: string
  title: string
  description?: string
  type: 'public' | 'private'
  ownerIds: string[]
  memberIds: string[]
  columnOrderIds: string[]
  columns: IColumn[]
}
