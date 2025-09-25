import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {chatUrl, messageUrl} from '../../../const';

@Injectable({
  providedIn: 'root',
})

export class ChatService {
  http = inject(HttpClient);

  createChat(userId: number) {
    return this.http.post(`${chatUrl}${userId}`, {})
  }

  getChatById(chatId: number) {
    return this.http.get(`${chatUrl}${chatId}`)
  }

  getMyChats() {
    return this.http.get(`${chatUrl}get_my_chats/`);
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post(`${messageUrl}${chatId}`, {}, {
        params: {
          message
        }
      })
  }

}
