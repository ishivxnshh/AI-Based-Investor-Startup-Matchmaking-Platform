import { useState } from 'react'
import ChatContainer from '../components/Chat/ChatContainer'
import RightSideBar from '../components/Chat/RightSidebar'
import SideBar from '../components/Chat/SideBar'

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(false)

  return (
    <div className="w-full h-screen">
      {/* Background layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-cover w-full h-full blur-md -z-10"></div>

      <div className="relative w-full h-full border sm:px-[15%] sm:py-[5%]">
        <div
          className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
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