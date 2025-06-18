import { useTheme } from '@emotion/react'
import { Box, Container, type CssVarsTheme } from '@mui/material'
import ModeSelect from '../../components/mode-select/ModeSelect'

function Board() {
  const theme = useTheme() as CssVarsTheme
  return (
    <Container
      disableGutters
      maxWidth={false}
      className="h-screen"
      sx={{ backgroundColor: 'primary.main' }}
    >
      <Box
        className="w-full flex items-center"
        sx={{
          height: theme.trello.appBarHeight,
          backgroundColor: 'primary.main'
        }}
      >
        <ModeSelect />
      </Box>
      <Box
        className="w-full flex items-center"
        sx={{
          height: theme.trello.boardBarHeight,
          backgroundColor: 'primary.light'
        }}
      >
        board bar
      </Box>
      <Box
        className="w-full flex items-center"
        sx={{
          height: `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
          backgroundColor: 'primary.dark'
        }}
      >
        board content
      </Box>
    </Container>
  )
}

export default Board