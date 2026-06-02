import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Send, Loader2 } from "lucide-react";
import { getBookingMessages, sendBookingMessage } from "../api/booking.api";
import { formatDate } from "../../../utils/helpers";

const MessagePanel = ({ bookingId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await getBookingMessages(bookingId);
      setMessages(res.data?.messages || []);
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await sendBookingMessage(bookingId, { content: newMessage });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="font-bold text-slate-900 dark:text-white">Messages</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Communicate regarding this booking</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 my-auto pt-20">
            No messages yet. Send a message to start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg text-slate-900 dark:text-white transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex-shrink-0"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagePanel;
