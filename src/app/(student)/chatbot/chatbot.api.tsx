import { AxiosInstance } from "axios";

export async function getAllChatRoom(axios: AxiosInstance) {
  const res = await axios.get("/chat/rooms");
  return res?.data?.data ?? [];
}

export async function getChatRoomMessages(
  axios: AxiosInstance,
  chatId: string,
) {
  const res = await axios.get("/chat/messages?chatId=" + chatId);
  return res?.data?.data ?? [];
}
export async function deleteChatRoom(axios: AxiosInstance, chatId: string) {
  const res = await axios.delete("/chat/rooms?chatId=" + chatId);
  return res?.data?.data;
}

export async function startNewChatRoom(axios: AxiosInstance) {
  const res = await axios.post("/chat/new-chat");
  return res?.data?.data;
}
export async function sendMessage(
  axios: AxiosInstance,
  data: { chatId: string; message: string; file?: File },
): Promise<any> {
  const formData = new FormData();
  formData.append("chatId", data.chatId);
  formData.append("message", data.message);

  if (data.file) {
    formData.append("file", data.file); // backend must expect 'file' field
  }

  const res = await axios.post("/chat/message", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res?.data?.data;
}
