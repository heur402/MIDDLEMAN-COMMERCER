import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import ConversationList from '../../components/chat/ConversationList'
import MessageThread from '../../components/chat/MessageThread'
import MessageInput from '../../components/chat/MessageInput'
import { PageSpinner } from '../../components/common/Spinner'
import { conversationsApi } from '../../api/conversations.api'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../hooks/useSocket'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { user }                = useAuth()
  const { emit, on }            = useSocket()
  const [searchParams]          = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [active, setActive]     = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs]   = useState(false)
  const [sending, setSending]   = useState(false)

  useEffect(() => {
    conversationsApi.list()
      .then(({ data }) => setConversations(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingConvs(false))
  }, [])

  useEffect(() => {
    const convId = searchParams.get('conv')
    if (!convId || conversations.length === 0) return
    const found = conversations.find((c) => c._id === convId)
    if (found) openConversation(found)
  }, [searchParams, conversations]) // eslint-disable-line

  const openConversation = useCallback(async (conv) => {
    if (active?._id === conv._id) return
    setActive(conv)
    setLoadingMsgs(true)
    try {
      const { data } = await conversationsApi.getById(conv._id)
      setMessages(data.data?.messages ?? [])
      emit('join:conversation', { conversationId: conv._id })
    } catch { setMessages([]) }
    finally { setLoadingMsgs(false) }
  }, [active, emit])

  useEffect(() => {
    if (!active) return
    return on('message:new', ({ conversationId, message }) => {
      if (conversationId === active._id) setMessages((p) => [...p, message])
    })
  }, [active, on])

  async function handleSend({ text }) {
    if (!active) return
    setSending(true)
    try {
      const { data } = await conversationsApi.sendMessage(active._id, { text })
      setMessages((p) => [...p, data.data])
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to send')
    } finally { setSending(false) }
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-0 sm:px-4 py-0 sm:py-6">
        <div className="flex h-[calc(100vh-8rem)] sm:h-[600px] bg-white sm:rounded-2xl sm:shadow-sm overflow-hidden border-0 sm:border border-gray-200">

          {/* Conversation sidebar */}
          <div className={`w-full sm:w-72 border-r border-gray-200 flex flex-col ${active ? 'hidden sm:flex' : 'flex'}`}>
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Messages</h2>
            </div>
            {loadingConvs
              ? <PageSpinner />
              : <div className="flex-1 overflow-y-auto">
                  <ConversationList
                    conversations={conversations}
                    activeId={active?._id}
                    onSelect={openConversation}
                    currentUserId={user?._id}
                  />
                </div>
            }
          </div>

          {/* Thread panel */}
          <div className={`flex-1 flex flex-col ${!active ? 'hidden sm:flex' : 'flex'}`}>
            {active ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <button className="sm:hidden p-1 text-gray-400 hover:text-orange-500" onClick={() => setActive(null)}>←</button>
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                    {active.participants?.find((p) => (p._id ?? p) !== user?._id)?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {active.participants?.find((p) => (p._id ?? p) !== user?._id)?.name ?? 'User'}
                  </p>
                </div>
                {loadingMsgs
                  ? <div className="flex-1 flex items-center justify-center"><PageSpinner /></div>
                  : <MessageThread messages={messages} currentUserId={user?._id} />
                }
                <MessageInput onSend={handleSend} loading={sending} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-400">
                <MessageCircle size={48} className="opacity-30" />
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
