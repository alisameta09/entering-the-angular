import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {LastMessageRes} from '../../../data/interfaces/chats.interface';

@Component({
  selector: 'button[chats]',
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './chat-btns.component.html',
  styleUrl: './chat-btns.component.scss'
})
export class ChatBtnsComponent {
  chat = input<LastMessageRes>()
}
