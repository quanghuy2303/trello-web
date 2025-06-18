import { DarkModeOutlined, LightMode, SettingsBrightness } from '@mui/icons-material'
import { Box, FormControl, InputLabel, MenuItem, Select, useColorScheme, type SelectChangeEvent } from '@mui/material'
import type { IMode } from '../../common/interfaces/interfaceCommons'


function ModeSelect() {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event: SelectChangeEvent) => {
    const selectedMode = event.target.value
    setMode(selectedMode as IMode)

  }
  return (
    <FormControl className='!min-w-[120px]' size='small'>
      <InputLabel
        id="label-select-dark-light-mode"
        sx={{
          color: 'white',
          "&:Mui-focused": { color: "white" }
        }}
      >
        Mode
      </InputLabel>
      <Select
        labelId='label-select-dark-light-mode'
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: 'white',
          ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          ".MuiSvgIcon-root": { color: "white" }
        }}
      >
        <MenuItem value="light">
          <Box className="flex items-center gap-2">
            <LightMode fontSize='small' /> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box className="flex items-center gap-2">
            <DarkModeOutlined fontSize='small' /> Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box className="flex items-center gap-2">
            <SettingsBrightness fontSize='small' /> System
          </Box>
        </MenuItem>

      </Select>

    </FormControl >
  )
}

export default ModeSelect