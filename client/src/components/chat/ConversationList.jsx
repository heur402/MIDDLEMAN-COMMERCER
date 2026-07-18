import { cn } from '../../utils/cn'
import { formatRelativeTime } from '../../utils/formatDate'
import { MessageCircle } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export default function ConversationList({ conversations = [], activeId, onSelect, currentUserId }) {
  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No conversations yet"
        description="Start a conversation from a product page."
      />
    )
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {conversations.map((conv) => {
        const other  = conv.participants?.find((p) => (p._id ?? p) !== currentUserId)
        const lastMsg = conv.messages?.[conv.messages.length - 1]
        const isActive = conv._id === activeId

        return (
          <button
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors w-full',
              isActive && 'bg-orange-50 border-l-2 border-orange-500'
            )}
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
              {other?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">{other?.name ?? 'User'}</p>
                {lastMsg && <span className="text-[10px] text-gray-400 shrink-0 ml-2">{formatRelativeTime(lastMsg.createdAt)}</span>}
              </div>
              <p className="text-xs text-gray-500 truncate">{lastMsg?.text || 'No messages yet'}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
