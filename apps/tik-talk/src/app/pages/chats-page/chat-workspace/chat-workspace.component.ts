import { Component, inject } from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatMessagesWrapperComponent } from './chat-messages-wrapper/chat-messages-wrapper.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../../../../../libs/chats/src/lib/data/services/chat.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat-workspace',
  imports: [ChatHeaderComponent, ChatMessagesWrapperComponent, AsyncPipe],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  chatService = inject(ChatService);

  activeChat$ = this.route.params.pipe(switchMap(({ id }) => this.chatService.getChatById(id)));
}
