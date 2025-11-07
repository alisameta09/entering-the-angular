import {ChatConnectionWSParams, ChatWSService} from "../interfaces/chat-ws-service.interface";
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {webSocket} from 'rxjs/webSocket';
import {finalize, Observable, tap} from 'rxjs';
import {ChatWSMessage} from "../interfaces/chat-ws-message.interface";
import {inject} from '@angular/core';
import {AuthService} from '@tt/data-access/auth';

export class ChatWSRxjsService implements ChatWSService {
  #authService = inject(AuthService);

  #socket: WebSocketSubject<ChatWSMessage> | null = null;

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      })
    }

    return this.#socket.asObservable()
      .pipe(
        tap(message => params.handleMessage(message)),
        finalize(() => {
          console.log('WebSocket closed');
          this.disconnect(params);
        })
      );
  }

  disconnect(params: ChatConnectionWSParams): void {
    this.#authService.refreshAuthToken().subscribe({
      next: () => {
        this.#socket?.complete();
        this.#socket = null;

        this.connect({
          url: params.url,
          token: this.#authService.token!,
          handleMessage: params.handleMessage
        });
      },
      error: () => this.#authService.logout()
    })
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId
    })
  }
}
