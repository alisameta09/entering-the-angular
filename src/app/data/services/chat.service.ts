import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {chatUrl, messageUrl} from '../../../const';
import {Chat, LastMessageRes, Message} from '../interfaces/chats.interface';

@Injectable({
  providedIn: 'root',
})

export class ChatService {
  http = inject(HttpClient);

  createChat(userId: number) {
    return this.http.post<Chat>(`${chatUrl}${userId}`, {})
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${chatUrl}${chatId}`)
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${chatUrl}get_my_chats/`);
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(`${messageUrl}${chatId}`, {}, {
        params: {
          message
        }
      })
  }

}
