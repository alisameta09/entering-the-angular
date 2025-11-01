import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatListComponent} from '../chat-list/chat-list.component';
import {ChatService} from '@tt/data-access/chats';

@Component({
  selector: 'app-chats-page',
  imports: [RouterOutlet, ChatListComponent],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss',
})
export class ChatsPageComponent implements OnInit {
  #chatService = inject(ChatService);

  ngOnInit() {
    this.#chatService.connectWs();
  }
}
