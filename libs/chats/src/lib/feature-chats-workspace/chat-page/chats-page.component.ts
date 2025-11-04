import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatListComponent} from '../chat-list/chat-list.component';
import {ChatService} from '@tt/data-access/chats';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-page',
  imports: [RouterOutlet, ChatListComponent],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss',
})
export class ChatsPageComponent {
  #chatService = inject(ChatService);

  constructor() {
    this.#chatService.connectWs()
      .pipe(takeUntilDestroyed())
      .subscribe();
  }
}
