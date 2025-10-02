import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {chatUrl, messageUrl} from '../../../const';
import {Chat, LastMessageRes, Message} from '../interfaces/chats.interface';
import {map} from 'rxjs';
import {ProfileService} from './profile.service';

@Injectable({
  providedIn: 'root',
})

export class ChatService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<Message[]>([]);

  createChat(userId: number) {
    return this.http.post<Chat>(`${chatUrl}${userId}`, {})
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${chatUrl}${chatId}`)
      .pipe(map(chat => {
          const patchedMessages = chat.messages.map(message => {
            return {
              ...message,
              user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
              isMine: message.userFromId === this.me()!.id,
            }
          })

          this.activeChatMessages.set(patchedMessages)

          return {
            ...chat,
            companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
            messages: patchedMessages
          }
        })
      )
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${chatUrl}get_my_chats/`);
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(`${messageUrl}send/${chatId}`, {}, {
      params: {
        message
      }
    })
  }

}
