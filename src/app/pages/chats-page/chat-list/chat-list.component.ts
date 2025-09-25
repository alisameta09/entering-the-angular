import {Component, inject} from '@angular/core';
import {ChatBtnsComponent} from '../chat-btns/chat-btns.component';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ChatService} from '../../../data/services/chat.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-chat-list',
  imports: [
    ChatBtnsComponent,
    SvgIconComponent,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chatService = inject(ChatService);

  chats$ = this.chatService.getMyChats();
}
