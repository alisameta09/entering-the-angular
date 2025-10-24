import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { debounceTime, firstValueFrom, fromEvent, switchMap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import {PostInputComponent} from '@tt/posts';
import {Chat, ChatService} from '@tt/data-access/chats';

@Component({
  selector: 'app-chat-messages-wrapper',
  imports: [ChatMessageComponent, PostInputComponent],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss',
})
export class ChatMessagesWrapperComponent implements OnInit, AfterViewInit {
  private readonly PADDING = 24;

  chatService = inject(ChatService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef);

  chat = input.required<Chat>();

  messages = this.chatService.groupedChatMessages;

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLElement>;
  @ViewChildren('lastMessage') lastMessage?: QueryList<ElementRef<HTMLElement>>;

  ngOnInit() {
    timer(0, 3000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.chatService.getChatById(this.chat().id))
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.resizeChatPage();

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizeChatPage());

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
      behavior: 'smooth',
    });
  }

  resizeChatPage(): void {
    const el = this.hostElement.nativeElement;
    const { top } = el.getBoundingClientRect();
    const height = window.innerHeight - top - this.PADDING;

    this.r2.setStyle(el, 'height', `${height}px`);
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatService.getChatById(this.chat().id));

    setTimeout(() => this.scrollToLastMessage());
  }
}
