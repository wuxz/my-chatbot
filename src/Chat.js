import './Chat.css';
import React, { useState, useEffect } from "react";
import { login, sendMessage } from "./api"; // 导入 API 相关函数
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';

const Chat = ({ BaiduApiKey, BaiduAppId }) => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "请输入你的问题，开始咨询吧。" }]);
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 登录函数
  const handleLogin = async () => {
    const { conversationId, error } = await login(BaiduAppId, BaiduApiKey);
    if (error) {
      setError(error);
    } else {
      setConversationId(conversationId);
      setError(null); // 清除错误信息
    }
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChatClick = () => {
    setIsChatOpen(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputText.trim()) { // 只有当输入框有内容且按下回车键时才发送
      handleSendMessage();
    }
  };

  // 组件挂载时自动登录
  useEffect(() => {
        handleLogin();
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim() === "" || !conversationId) return;

    // 添加用户消息到聊天记录
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: inputText },
    ]);
    setInputText("");

    const { answer, error } = await sendMessage(BaiduAppId, BaiduApiKey, conversationId, inputText);

    if (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: error },
      ]);
    } else {
      // 添加机器人的回复到聊天记录
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: answer },
      ]);
    }
  };

  return (
    <div>
      {error ? (
        <div className="error-message">{error}</div> // 显示登录错误信息
      ) : (
        <div className="chat-container">
          {isChatOpen && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "chat-message user-message" : "chat-message bot-message"}>
                {msg.text}
              </div>
            ))}
          </div>
          <FontAwesomeIcon icon={faMinusSquare} className="minimize-icon" onClick={handleCloseChatClick} />
          <div className="chat-input">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入消息..."
              disabled={!!error}
              onKeyDown={handleInputKeyDown}
            />

          <button onClick={handleSendMessage} disabled={!!error || !inputText.trim()}>发送</button> {/* 登录失败时禁用发送按钮 */}
          </div>
        </div>
        )}
        {!isChatOpen && (
          <button onClick={handleChatClick} >开始咨询</button>
        )}
        </div>
      )}
    </div>
  );
};

export default Chat;
