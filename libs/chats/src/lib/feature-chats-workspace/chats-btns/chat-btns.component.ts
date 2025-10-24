import { Component, input } from '@angular/core';
import { LastMessageRes } from '../../data/interfaces/chats.interface';
import {AvatarCircleComponent, DateTransformPipe} from '@tt/common-ui';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, DateTransformPipe],
  templateUrl: './chat-btns.component.html',
  styleUrl: './chat-btns.component.scss',
})
export class ChatBtnsComponent {
  chat = input<LastMessageRes>();
}
