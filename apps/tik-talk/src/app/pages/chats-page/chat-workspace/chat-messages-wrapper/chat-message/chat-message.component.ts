import { Component, HostBinding, input } from '@angular/core';
import { Message } from '../../../../../data/interfaces/chats.interface';
import {AvatarCircleComponent, DateTransformPipe} from '@tt/common-ui';

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
