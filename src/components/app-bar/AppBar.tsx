import { Badge, Box, Button, InputAdornment, SvgIcon, TextField, Tooltip, Typography, type CssVarsTheme } from '@mui/material'
import ModeSelect from '../mode-select/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloLogo } from "~/assets/svgs/mdi--trello.svg"
import Workspaces from './menus/Workspaces'
import Recent from './menus/Recent'
import Starred from './menus/Starred'
import Templates from './menus/Templates'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { useTheme } from '@emotion/react'

function AppBar() {
  const [searchValue, setSearchValue] = useState<string>("")
  const theme = useTheme() as CssVarsTheme
  
  return (
    <Box
      className={`w-full flex items-center justify-between overflow-x-auto`}
      sx={{
        height: theme.trello.appBarHeight,
        bgcolor: theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0"
      }}
    >
      <Box className='flex items-center gap-2'>
        <AppsIcon className='text-white' />
        <Box className='flex items-center gap-1'>
          <SvgIcon className='text-white' fontSize='small' component={trelloLogo} inheritViewBox />
          <Typography
            component="span"
            className='!text-[16px] !font-bold text-white'
          >
            Trello
          </Typography>
        </Box>
        <Box sx={{
          display: {
            xs: "none", md: "flex"
          },
          gap: 1
        }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{ color: "white" }}
            variant='text'
            startIcon={<LibraryAddIcon />}
          >
            create
          </Button>
        </Box>
      </Box>
      <Box className='flex items-center gap-2'>
        <TextField
          id="outlined-search"
          label="Search"
          placeholder='Search...'
          type="text"
          size='small'
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon className='text-white' />
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                fontSize='small'
                className={`${searchValue ? "text-white" : "text-transparent"} cursor-pointer`}
                onClick={() => setSearchValue("")}
              />
            )
          }}
          sx={{
            minWidth: "120px",
            maxWidth: "170px",
            "& label": { color: "white" },
            "& input": { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&:Mui-focused fieldset": { borderColor: "white" }
            }
          }}
        />
        <ModeSelect />

        <Tooltip title='Notification'>
          <Badge color="warning" variant="dot" className='cursor-pointer'>
            <NotificationsNoneIcon className='text-white' />
          </Badge>
        </Tooltip>
        <Tooltip title='Help' className='cursor-pointer'>
          <HelpOutlineIcon className='text-white' />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar