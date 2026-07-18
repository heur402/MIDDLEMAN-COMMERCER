/**
 * Notification service — Phase 1 stub.
 * All sends are logged to console only.
 * Phase 2 will replace these with real Socket.IO emissions
 * and optionally an email/SMS provider.
 */

export const NotificationType = {
  ORDER_PLACED:        'order:placed',
  ORDER_CONFIRMED:     'order:confirmed',
  ORDER_SHIPPED:       'order:shipped',
  ORDER_DELIVERED:     'order:delivered',
  ORDER_COMPLETED:     'order:completed',
  ORDER_CANCELLED:     'order:cancelled',
  NEW_MESSAGE:         'message:new',
  DISPUTE_OPENED:      'dispute:opened',
  DISPUTE_UPDATED:     'dispute:updated',
  DISPUTE_RESOLVED:    'dispute:resolved',
}

/**
 * Send an in-app notification (stub).
 * @param {string} userId     Recipient user ID
 * @param {string} type       NotificationType constant
 * @param {object} payload    Extra context (orderId, message, etc.)
 */
export function sendNotification(userId, type, payload = {}) {
  // TODO Phase 2: persist to Notification model + emit via Socket.IO
  console.log(`[NOTIFICATION] → user:${userId} | ${type}`, payload)
}

/**
 * Notify both buyer and seller of an order status change.
 */
export function notifyOrderStatus(order, newStatus) {
  sendNotification(order.buyerId.toString(), NotificationType[`ORDER_${newStatus.toUpperCase()}`], {
    orderId: order._id,
    status: newStatus,
  })
  sendNotification(order.sellerId.toString(), NotificationType[`ORDER_${newStatus.toUpperCase()}`], {
    orderId: order._id,
    status: newStatus,
  })
}
