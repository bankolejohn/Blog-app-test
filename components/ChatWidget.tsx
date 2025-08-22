import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl z-40 overflow-hidden">
          {process.env.NEXT_PUBLIC_CHAT_URL ? (
            <iframe
              src={process.env.NEXT_PUBLIC_CHAT_URL}
              className="w-full h-full border-0"
              title="Chat Support"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 p-4 text-center">
              Chat unavailable. Set NEXT_PUBLIC_CHAT_URL in env to enable.
            </div>
          )}
        </div>
      )}
    </>
  )
}