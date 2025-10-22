import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import {chatUrl, messageUrl} from '@tt/shared';
import {ProfileService} from '@tt/profile';
import {DateTransformPipe} from '@tt/common-ui';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  groupedChatMessages = signal<
    {
      label: string;
      messages: Message[];
    }[]
  >([]);

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
      {
        params: {
          message,
        },
      }
    );
  }
}
