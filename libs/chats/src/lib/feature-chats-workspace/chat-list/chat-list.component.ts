import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatBtnsComponent } from '../chats-btns/chat-btns.component';
import { SvgIconComponent } from '@tt/common-ui';
import {ChatService} from '@tt/data-access/chats';

@Component({
  selector: 'app-chat-list',
  imports: [
    ChatBtnsComponent,
    SvgIconComponent,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent {
  chatService = inject(ChatService);

  chatsFilterControl = new FormControl('');

  chats$ = this.chatService.getMyChats().pipe(
    switchMap((chats) => {
      return this.chatsFilterControl.valueChanges.pipe(
        startWith(''),
        map((inputValue) => {
          return chats.filter((chat) => {
            return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
              .toLowerCase()
              .includes((inputValue ?? '').toLowerCase());
          });
        })
      );
    })
  );
}
