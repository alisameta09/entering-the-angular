import { Component } from '@angular/core';
import {ChatBtnsComponent} from '../chat-btns/chat-btns.component';

@Component({
  selector: 'app-chat-list',
  imports: [
    ChatBtnsComponent
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {

}
