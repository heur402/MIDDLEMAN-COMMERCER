import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function MessageInput({ onSend, disabled = false, loading = false }) {
  const [text, setText] = useState('')
  const textareaRef     = useRef()

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend?.({ text: trimmed })
    setText('')
    textareaRef.current?.focus()
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Ctrl+Enter to send)"
          disabled={disabled}
          className={cn(
            'flex-1 resize-none rounded-2xl border border-gray-300 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent max-h-32 overflow-y-auto'
          )}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || loading || !text.trim()}
          className="p-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 transition-colors shrink-0"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
