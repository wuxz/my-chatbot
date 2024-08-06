import React, { useState, useEffect } from "react";
import { login, sendMessage } from "./api"; // 导入 API 相关函数

const Chat = ({ BaiduApiKey, BaiduAppId }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);

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
        <div>
          <div>
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                {msg.text}
              </div>
            ))}
          </div>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入消息..."
            disabled={!!error} // 登录失败时禁用输入框
          />
          <button onClick={handleSendMessage} disabled={!!error}>发送</button> {/* 登录失败时禁用发送按钮 */}
        </div>
      )}
    </div>
  );
};

export default Chat;
