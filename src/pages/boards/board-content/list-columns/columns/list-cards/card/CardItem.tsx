import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import type { ICard } from '~/pages/boards/interfaceBoards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type ICardItemProps = {
  card: ICard
}

function CardItem({ card }: ICardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card }
  })


  const dndCardStyle = {
    // touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  }

  const shouldShowCardAction = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  return (
    <Card
      ref={setNodeRef} style={dndCardStyle} {...attributes} {...listeners}
      sx={{
        boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
        overflow: "unset"
      }}
      className='cursor-pointer'
    >
      {card?.cover &&
        <CardMedia
          sx={{ height: 140 }}
          image={card.cover}
          title="green iguana"
        />}
      <CardContent className='p-1.5 ' sx={{ "&:last-child": { p: 1.5 } }}>
        <Typography >{card?.title}</Typography>
      </CardContent>
      {
        shouldShowCardAction() &&
        <CardActions className='!px-[4px] !pb-[8px]'>
          {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>}
          {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>}
          {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}
        </CardActions>
      }
    </Card>
  )
}

export default CardItem