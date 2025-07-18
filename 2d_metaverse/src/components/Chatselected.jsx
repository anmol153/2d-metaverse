import { useEffect, useRef } from "react";
import { useChatStore} from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import Message from "./Messages";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../Constants/time";
import { useAuthStore } from "../store/useAuthStore";
const Chatselected = () => {
  const {messages,getMessage,isMessgeLoading,selectedUser,subscribeToMessage,unsubscribeFromMessage} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(()=>{
    getMessage(selectedUser._id);
    subscribeToMessage();

    return ()=> unsubscribeFromMessage();
  },[selectedUser]);

  useEffect(()=>{
    if(messageEndRef?.current && messages) {
      messageEndRef.current.scrollIntoView({behaviour:"smooth"});
    }
  },[messages]);
  if(isMessgeLoading) return (
    <div className="flex-1  flex-col overflow-auto ">
      <ChatHeader/>
      <MessageSkeleton/>
      <Message/>
    </div>
  )
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end " : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.avatar
                      : selectedUser.avatar 
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200"}`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <Message/>
    </div>
  );
};

export default Chatselected;