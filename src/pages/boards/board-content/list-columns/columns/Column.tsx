import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  type CssVarsTheme
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React, { useState } from 'react'
import { COLUMN_FOOTER_HEIGHT, COLUMN_HEADER_HEIGHT } from '~/common/constants/constantsSize'
import { AddCard, Cloud, ContentCut } from '@mui/icons-material'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { useTheme } from '@emotion/react'
import ListCards from './list-cards/ListCards'
import type { IColumn } from '~/pages/boards/interfaceBoards'
import { mapOrder } from '~/common/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface IColumnProps {
  column: IColumn
}

function Column({ column }: IColumnProps) {
  const theme = useTheme() as CssVarsTheme

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column._id,
    data: { ...column }
  })


  const dndColumsStyle = {
    // touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget) }
  const handleClose = () => { setAnchorEl(null) }

  return (
    <div ref={setNodeRef} style={dndColumsStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: "300px",
          maxWidth: "700px",
          bgcolor: theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          maxHeight: `calc(${theme.trello.boardContentHeight} - 100px"`
        }}
        className="ml-2 rounded-[6px] h-fit overflow-x-hidden overflow-y-auto"
      >
        {/* box column */}
        <Box
          sx={{
            height: COLUMN_HEADER_HEIGHT
          }}
          className="flex items-center justify-between px-2"
        >
          <Typography
            className='!font-bold cursor-pointer'
            variant='h6'
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="Mode option">
              <span
                id="basic-column-dropdown"
                onClick={handleClick}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                className='cursor-pointer'
              >
                <ExpandMoreIcon sx={{ color: 'text.primary' }} />
              </span>
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
                <Typography variant="body2" color="text.secondary">
                  ⌘X
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Web Clipboard</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/*box card */}
        <ListCards cards={mapOrder(column.cards, column.cardOrderIds, "_id")} />

        {/*box footer */}
        <Box
          sx={{
            height: COLUMN_FOOTER_HEIGHT
          }}
          className="flex items-center justify-between px-2"
        >
          <Button startIcon={<AddCard />}>Add new card</Button>
          <Tooltip title="drag to more">
            <DragHandleIcon className='cursor-pointer' />
          </Tooltip>
        </Box>

      </Box>
    </div>
  )
}

export default Column