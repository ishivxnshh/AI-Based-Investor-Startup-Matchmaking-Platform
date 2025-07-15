import { useState } from 'react'
import ChatContainer from '../components/Chat/ChatContainer'
import RightSideBar from '../components/Chat/RightSidebar'
import SideBar from '../components/Chat/SideBar'

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(false)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-cover bg-center blur-sm brightness-75 -z-10"></div>

      {/* Foreground Chat UI */}
      <div className="relative w-full h-full flex items-center justify-center px-4 py-6 sm:px-[10%] sm:py-[5%]">
        <div
          className={`w-full h-full backdrop-blur-2xl border-2 border-gray-600 rounded-2xl overflow-hidden grid grid-cols-1 ${
            selectedUser
              ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
              : 'md:grid-cols-2'
          }`}
        >
          <SideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          <RightSideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage