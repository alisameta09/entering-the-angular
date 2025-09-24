import { Component } from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {PostInputComponent} from '../../../profile-page/post-input/post-input.component';

@Component({
  selector: 'app-chat-messages-wrapper',
  imports: [
    ChatMessageComponent,
    PostInputComponent
  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss'
})
export class ChatMessagesWrapperComponent {

}
