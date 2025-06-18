import { Button, useColorScheme } from "@mui/material"

export default function ModeToggle() {
  const { mode, setMode } = useColorScheme()

  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
      variant="contained"
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}