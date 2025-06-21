import { Box, Button } from '@mui/material'
import Column from './columns/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import type { IColumn } from '../../interfaceBoards'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

interface IListColumnsProps {
  columns: IColumn[]
}

function ListColumns({ columns }: IListColumnsProps) {
  return (
    <SortableContext items={columns.map(col => col._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{ '&::-webkit-scrollbar-track': { m: 2 } }}
        className='w-full h-full overflow-x-auto overflow-y-hidden flex'
      >
        {columns?.map((column: IColumn) => <Column key={column?._id} column={column} />)}
        <Box
          sx={{
            minWidth: '200px',
            maxWidth: '200px',
            bgcolor: '#ffffff3d',
            borderRadius: '6px'
          }}
          className='!rounded-[6px] h-fit mx-2'
        >
          <Button
            startIcon={<NoteAddIcon />}
            className='!text-white w-full !justify-start !pl-2.5 !py-1'
          >
            add new columns
          </Button>
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns