import { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'
import { formatRelativeTime } from '../../utils/formatDate'

export default function MessageThread({ messages = [], currentUserId }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400 p-4">
        No messages yet — say hello!
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {messages.map((msg, i) => {
        const isMine = msg.senderId === currentUserId || msg.senderId?._id === currentUserId
        return (
          <div key={msg._id ?? i} className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}>
            {!isMine && (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
                {msg.senderId?.name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <div className={cn('flex flex-col gap-0.5 max-w-[72%]', isMine ? 'items-end' : 'items-start')}>
              <div className={cn('px-3 py-2 rounded-2xl text-sm leading-relaxed', isMine ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm')}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 px-1">{formatRelativeTime(msg.createdAt)}</span>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
