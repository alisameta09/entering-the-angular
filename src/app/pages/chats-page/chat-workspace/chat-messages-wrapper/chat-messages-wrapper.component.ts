import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input, QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {PostInputComponent} from '../../../profile-page/post-input/post-input.component';
import {ChatService} from '../../../../data/services/chat.service';
import {Chat} from '../../../../data/interfaces/chats.interface';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-messages-wrapper',
  imports: [
    ChatMessageComponent,
    PostInputComponent
  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss'
})
export class ChatMessagesWrapperComponent implements AfterViewInit {
  PADDING = 24;

  chatService = inject(ChatService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef)

  chat = input.required<Chat>()

  messages = this.chatService.activeChatMessages;

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLElement>;
  @ViewChildren('lastMessage') lastMessage?: QueryList<HTMLElement>;

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.resizeFeed());

    this.lastMessage?.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.scrollToLastMessage());

    setTimeout(() => this.scrollToLastMessage());
  }

  scrollToLastMessage() {
    const container = this.messagesContainer?.nativeElement;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    })
  }

  resizeFeed(): void {
    const el = this.hostElement.nativeElement;
    const {top} = el.getBoundingClientRect();
    const height = (window.innerHeight - top - this.PADDING);

    this.r2.setStyle(el, 'height', `${height}px`);
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatService.getChatById(this.chat().id));

    setTimeout(() => this.scrollToLastMessage());
  }

}
