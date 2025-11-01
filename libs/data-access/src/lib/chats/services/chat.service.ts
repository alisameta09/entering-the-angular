import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import {chatUrl, messageUrl} from '@tt/shared';
import {DateTransformPipe} from '@tt/common-ui';
import {Chat, Message, LastMessageRes} from '../index';
import {ChatWsNativeService} from './chat-ws-native.service';
import {AuthService, GlobalStoreService} from 'libs/data-access/src';
import {ChatWSService} from '../interfaces/chat-ws-service.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http = inject(HttpClient);
  me = inject(GlobalStoreService).me;
  #authService = inject(AuthService);

  wsAdapter: ChatWSService = new ChatWsNativeService();

  groupedChatMessages = signal<{ label: string; messages: Message[] }[]>([]);

  connectWs() {
    this.wsAdapter.connect({
      url: `${chatUrl}ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    });
  }

  handleWSMessage(message: unknown) {
    console.log(message);
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${chatUrl}${userId}`, {});
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${chatUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        const groupedMessages = this.groupMessagesByDay(patchedMessages);
        this.groupedChatMessages.set(groupedMessages);

        return {
          ...chat,
          companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  groupMessagesByDay(messages: Message[]) {
    const groups: Record<string, Message[]> = {};
    const datePipe = new DateTransformPipe();

    messages.forEach((message) => {
      const dayLabel = datePipe.transform(message.createdAt, '', false, true);

      if (!groups[dayLabel]) groups[dayLabel] = [];

      groups[dayLabel].push(message);
    });

    return Object.keys(groups).map((day) => ({
      label: day,
      messages: groups[day],
    }));
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${chatUrl}get_my_chats/`);
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${messageUrl}send/${chatId}`,
      {},
      {params: {message}}
    );
  }
}
