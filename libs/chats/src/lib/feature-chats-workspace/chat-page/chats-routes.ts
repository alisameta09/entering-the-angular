import { ChatWorkspaceComponent } from '../chat-workspace/chat-workspace.component';
import { Route } from '@angular/router';
import {ChatsPageComponent} from './chats-page.component';

export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
];
