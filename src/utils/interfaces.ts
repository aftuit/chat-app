export interface IUser {
    id: number | null,
    role: string,
  }
export interface ReplyMessage {
    id: number;
    message_unique_id: number;
    message: string;
    sender_id: number;
  }
  
export interface MessagePayload {
    chat_room_id: number;
    message: string;
    reply_message: ReplyMessage | null;
  }
  
export interface Message {
    action: string;
    payload: MessagePayload;
    query?: {
      page?: number;
      page_size?: number;
    };
  }
  
