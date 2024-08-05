import axios from "axios";

const BASE_URL = 'https://qianfan.baidubce.com/v2/app';

// 登录并获取 conversation_id
export const login = async (appId, apiKey) => {
  try {
    const response = await axios.post(`${BASE_URL}/conversation`, {
      app_id: appId,
    }, {
      headers: {
        'X-Appbuilder-Authorization': `Bearer bce-v3/${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.conversation_id
      ? { conversationId: response.data.conversation_id }
      : { error: "登录失败：未能获取对话ID。请稍后重试。" };
  } catch (error) {
    return { error: "登录失败：无法连接到服务器。请检查网络连接或稍后重试。" };
  }
};

// 发送消息并获取回复
export const sendMessage = async (appId, apiKey, conversationId, query) => {
  try {
    const response = await axios.post(`${BASE_URL}/conversation/runs`, {
      app_id: appId,
      query: query,
      conversation_id: conversationId,
      stream: false,
    }, {
      headers: {
        'X-Appbuilder-Authorization': `Bearer bce-v3/${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return { answer: response.data.answer };
  } catch (error) {
    return { error: "对不起，无法获取回复。请稍后再试。" };
  }
};
