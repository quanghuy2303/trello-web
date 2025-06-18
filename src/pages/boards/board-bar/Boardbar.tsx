import { Avatar, AvatarGroup, Box, Button, Chip, Tooltip, type CssVarsTheme } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import avatar from "~/assets/images/co_len.jpg"
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useTheme } from '@emotion/react'
import type { IBoard } from '../interfaceBoards'
import { capitalizeFirstLetter } from '~/common/utils/formatter'

const MENU_STYLES = {
  color: 'white',
  background: "transparent",
  ".MuiSvgIcon-root": {
    color: 'white'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}

export interface IBoardBarProps {
  board: IBoard
}

function BoardBar(props: IBoardBarProps) {
  const { board } = props
  const theme = useTheme() as CssVarsTheme
  return (
    <Box
      className="w-full flex items-center justify-between overflow-x-auto px-2"
      sx={{
        height: theme.trello.boardBarHeight,
        bgcolor: theme.palette.mode === "dark" ? "#34495e" : "#1976d2"
      }}
    >
      <Box className='flex items-center gap-2'>
        <Chip
          sx={MENU_STYLES}
          className='px-[5px] !rounded-[4px]'
          icon={<DashboardIcon />}
          label={board.title}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          className='px-[5px] !rounded-[4px]'
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          className='px-[5px] !rounded-[4px]'
          icon={<AddToDriveIcon />}
          label="App To Google drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          className='px-[5px] !rounded-[4px]'
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          className='px-[5px] !rounded-[4px]'
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box className='flex items-center gap-2'>
        <Button
          sx={{
            color: "white",
            borderColor: 'white',
            "&:hover": { borderColor: 'white' }
          }}
          variant='outlined'
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup max={4}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: "16px",
              border: "none"
            },
            color: "white",
            cursor: "pointer",
            "&:first-of-type": { bgcolor: "#a4b0de" }
          }}>
          <Tooltip title="trello">
            <Avatar src={avatar} />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar src={avatar} />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar src={avatar} />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar src={avatar} />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar src={avatar} />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar src={avatar} />
          </Tooltip>
          <Tooltip title="trello">
            <Avatar src={avatar} />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar