import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {chatUrl} from '@tt/shared';
import {DateTransformPipe} from '@tt/common-ui';
import {Chat, LastMessageRes, Message} from '../index';
import {AuthService, GlobalStoreService, Profile} from 'libs/data-access/src';
import {ChatWSService} from '../interfaces/chat-ws-service.interface';
import {ChatWSMessage} from '../interfaces/chat-ws-message.interface';
import {isNewMessage, isUnreadMessage} from '../interfaces/type-guards';
import {ChatWSRxjsService} from './chat-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http = inject(HttpClient);
  me = inject(GlobalStoreService).me;
  #authService = inject(AuthService);

  wsAdapter: ChatWSService = new ChatWSRxjsService();

  activeChats = signal<Record<number, { label: string; messages: Message[] }[]>>({});
  currentChatId = signal<number | null>(null);
  chatInfo = signal<Record<number, { companion: Profile }>>({});
  unreadMessagesCount = signal(0);

  setCurrentChatId(chatId: number) {
    this.currentChatId.set(chatId);

    this.activeChats.update(chats => {
      const groups = chats[chatId] ?? [];
      const updatedGroup = groups.map(group => ({
        ...group,
        messages: group.messages.map(message => ({
          ...message,
          isRead: true
        }))
      }))

      return {
        ...chats,
        [chatId]: updatedGroup
      }
    })

    this.unreadMessagesCount.set(this.calculateUnreadMessages());
  }

  connectWs() {
    return this.wsAdapter.connect({
      url: `${chatUrl}ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWsMessage
    }) as Observable<ChatWSMessage>;
  }

  calculateUnreadMessages() {
    return Object.values(this.activeChats())
      .reduce((acc, groups) => {
        for (const group of groups) {
          acc += group.messages
            .reduce((sum, message) => sum + (message.isRead ? 0 : 1), 0)
        }
        return acc;
      }, 0);
  }

  handleWsMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.unreadMessagesCount.set(this.calculateUnreadMessages());
    }

    if (isNewMessage(message)) {
      const chatId = message.data.chat_id;
      const isMine = message.data.author === this.me()?.id;

      const openedChat = this.currentChatId();
      const companion = this.chatInfo()[chatId].companion;

      if (!companion) return;

      let newMessage = {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: chatId,
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: chatId === openedChat,
        isMine,
        user: isMine ? this.me()! : companion
      }

      this.activeChats.update(chats => {
        const groups = chats[chatId] ?? [];
        const flat = groups.flatMap(group => group.messages);
        const updated = [
          ...flat,
          newMessage
        ];
        const regrouped = this.groupMessagesByDay(updated);

        return {
          ...chats,
          [chatId]: regrouped
        }
      })
    }
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${chatUrl}${userId}`, {});
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${chatUrl}${chatId}`).pipe(
      map((chat) => {
        const companion = chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst;

        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        const groupedMessages = this.groupMessagesByDay(patchedMessages);

        this.activeChats.update(chats => ({
          ...chats,
          [chatId]: groupedMessages
        }));

        this.chatInfo.update(info => ({
          ...info,
          [chatId]: {companion}
        }));

        return {
          ...chat,
          companion,
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
}
