import { Component, inject } from '@angular/core';
import { ChatBtnsComponent } from '../chat-btns/chat-btns.component';
import { SvgIconComponent } from '../../../../../../../libs/common-ui/src/lib/components/svg-icon/svg-icon.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../../data/services/chat.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';

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
