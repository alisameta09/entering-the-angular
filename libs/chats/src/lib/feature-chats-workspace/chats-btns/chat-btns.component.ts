import {Component, inject, input} from '@angular/core';
import {AvatarCircleComponent, DateTransformPipe} from '@tt/common-ui';
import {ChatService, LastMessageRes} from '@tt/data-access/chats';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, DateTransformPipe],
  templateUrl: './chat-btns.component.html',
  styleUrl: './chat-btns.component.scss',
})
export class ChatBtnsComponent {
  #chatService = inject(ChatService);

  unreadMessagesByChat = this.#chatService.unreadMessagesByChat;

  chat = input<LastMessageRes>();
}
