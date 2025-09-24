import { Component } from '@angular/core';
import {ChatHeaderComponent} from './chat-header/chat-header.component';
import {ChatMessagesWrapperComponent} from './chat-messages-wrapper/chat-messages-wrapper.component';

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatHeaderComponent,
    ChatMessagesWrapperComponent
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {

}
