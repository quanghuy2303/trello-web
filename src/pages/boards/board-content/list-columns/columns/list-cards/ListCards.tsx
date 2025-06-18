import { Box, type CssVarsTheme } from '@mui/material'
import { COLUMN_FOOTER_HEIGHT, COLUMN_HEADER_HEIGHT } from '~/common/constants/constantsSize'
import { useTheme } from '@emotion/react'
import CardItem from './card/CardItem'
import type { ICard } from '~/pages/boards/interfaceBoards'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface ICardsProps {
  cards: ICard[]
}

function ListCards({ cards }: ICardsProps) {
  const theme = useTheme() as CssVarsTheme
  return (
    <SortableContext items={cards.map(col => col._id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          maxHeight: `calc(
                ${theme.trello.boardContentHeight} - 
                ${theme.spacing(5)} - 
                ${COLUMN_HEADER_HEIGHT} -
                ${COLUMN_FOOTER_HEIGHT}
              )`,
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ced0da" },
          "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#bfc2cf" }
        }}
        className="flex flex-col gap-1 px-[5px] mx-[5px] overflow-x-hidden overflow-y-auto"
      >
        {cards?.map((card: ICard) => <CardItem key={card?._id} card={card} />)}
      </Box>
    </SortableContext>
  )
}

export default ListCards