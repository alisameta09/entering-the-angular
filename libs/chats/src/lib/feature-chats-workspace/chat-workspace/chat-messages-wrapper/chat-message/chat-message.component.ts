import { Component, HostBinding, input } from '@angular/core';
import {AvatarCircleComponent, DateTransformPipe} from '@tt/common-ui';
import {Message} from '@tt/data-access/chats';

@Component({
  selector: 'app-chat-message',
  imports: [AvatarCircleComponent, DateTransformPipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  message = input.required<Message>();

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }
}
