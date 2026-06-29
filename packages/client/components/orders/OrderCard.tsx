import { memo } from 'react';
import { Card, CardContent, Typography, Chip, Box, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  PENDING: 'warning', CONFIRMED: 'info', SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'error',
};

export const OrderCard = memo(function OrderCard({ order }: { order: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {order.id.slice(0, 8)}…
          </Typography>
          <Chip label={order.status} color={STATUS_COLOR[order.status] ?? 'default'} size="small" />
        </Box>
        <Divider sx={{ my: 1 }} />
        <List dense disablePadding>
          {order.items?.map((item: any) => (
            <ListItem key={item.id} disableGutters>
              <ListItemAvatar>
                <Avatar
                  src={item.imageUrl || `https://via.placeholder.com/40?text=${encodeURIComponent(item.productName[0])}`}
                  variant="rounded" sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.productName}
                secondary={`Qty: ${item.quantity} × $${Number(item.unitPrice).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6">Total: ${Number(order.totalAmount).toFixed(2)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
});
