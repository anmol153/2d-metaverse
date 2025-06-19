import React, { useEffect, useRef } from 'react';
import socket from '../socket';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../Constants/time';
import GroupMessageInput from './GroupMessage';

const GroupChat = () => {
  const { getGroup, getGroupMessage, GroupMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getGroup();
    getGroupMessage();
    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [GroupMessage]);

  return (
    <div className="flex-1 flex flex-col overflow-auto h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {GroupMessage.length == 0 ? <h1 className=' h-full flex justify-center items-center animate-pulse'>It's quiet here... say something 👋</h1>: 
        GroupMessage.map((message) => {
          const isMine = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`chat ${isMine ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header flex items-center gap-2 mb-1">
                <div className="avatar">
                  <div className="size-8 rounded-full border">
                    <img
                      src={
                        isMine
                          ? authUser.avatar
                          : message.avatar || "/default-avatar.png"
                      }
                      alt="avatar"
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  {isMine ? "You" : message.username || "Anonymous"}
                </span>
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div
                className={`chat-bubble flex flex-col ${
                  isMine
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }`}
              >
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
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <GroupMessageInput />
    </div>
  );
};

export { GroupChat };
