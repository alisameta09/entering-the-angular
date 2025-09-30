import {Component, input} from '@angular/core';
import {Message} from '../../../../../data/interfaces/chats.interface';
import {AvatarCircleComponent} from '../../../../../common-ui/avatar-circle/avatar-circle.component';
import {DateTransformPipe} from '../../../../../helpers/pipes/date-transform.pipe';

@Component({
  selector: 'app-chat-message',
  imports: [
    AvatarCircleComponent,
    DateTransformPipe
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  message = input.required<Message>();
}
