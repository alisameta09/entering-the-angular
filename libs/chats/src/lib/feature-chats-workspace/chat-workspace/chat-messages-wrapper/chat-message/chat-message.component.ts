import { Component, HostBinding, input } from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import {Message} from '@tt/data-access/chats';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [AvatarCircleComponent, DatePipe],
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
