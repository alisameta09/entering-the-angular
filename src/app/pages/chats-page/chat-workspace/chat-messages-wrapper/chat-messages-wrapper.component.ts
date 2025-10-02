import {Component, inject, input} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {PostInputComponent} from '../../../profile-page/post-input/post-input.component';
import {ChatService} from '../../../../data/services/chat.service';
import {Chat} from '../../../../data/interfaces/chats.interface';
import {firstValueFrom} from 'rxjs';

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
  chatService = inject(ChatService);

  chat = input.required<Chat>()

  messages = this.chatService.activeChatMessages;

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatService.getChatById(this.chat().id));
  }

}
