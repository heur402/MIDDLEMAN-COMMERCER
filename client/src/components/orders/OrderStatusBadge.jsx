import Badge, { statusVariant } from '../common/Badge'

const STATUS_LABELS = {
  pending:      'Pending',
  confirmed:    'Confirmed',
  shipped:      'Shipped',
  delivered:    'Delivered',
  completed:    'Completed',
  cancelled:    'Cancelled',
}

export default function OrderStatusBadge({ status }) {
  return (
    <Badge variant={statusVariant(status)}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
