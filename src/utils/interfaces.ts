export interface IUser {
  id: number | null;
  username: string;
}

export interface MessagePayload {
  chat_room_id: number;
  message: string;
  reply_message_id: string | null;
}

export interface Message {
  action: string;
  payload: MessagePayload;
  query?: {
    page?: number;
    page_size?: number;
  };
}
