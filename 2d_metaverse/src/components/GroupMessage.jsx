import { useState } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const GroupMessageInput = () => {
  const [text, setText] = useState("");
  const { authUser } = useAuthStore();
  const { sendGroupMessage } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendGroupMessage(authUser._id, {
      text: text.trim(),
      createdAt: new Date().toISOString(),
      senderId: authUser._id,
      avatar: authUser.avatar,
      username:authUser.username,
    });

    setText("");
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary h-10 min-h-0"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default GroupMessageInput;
