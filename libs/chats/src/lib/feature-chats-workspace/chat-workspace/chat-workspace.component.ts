import { Component, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatMessagesWrapperComponent } from './chat-messages-wrapper/chat-messages-wrapper.component';
import { ChatService } from '../../data';

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
