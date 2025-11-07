import { Chat, Message, LastMessageRes } from "./interfaces/chats.interface";
import { ChatService } from "./services/chat.service";
import { isErrorMessage } from './interfaces/type-guards';

export {
  ChatService,
  isErrorMessage
}

export type {
  Chat,
  Message,
  LastMessageRes
}
