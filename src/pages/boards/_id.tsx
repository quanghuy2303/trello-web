import { Container } from '@mui/material'
import BoardBar from './board-bar/Boardbar'
import BoardContent from './board-content/BoardContent'
import AppBar from '~/components/app-bar/AppBar'
import { mockData } from '~/common/apis/mockData'

function Board() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      className="h-screen"
    >
      <AppBar />
      <BoardBar board={mockData.board} />
      <BoardContent board={mockData.board} />
    </Container>
  )
}

export default Board