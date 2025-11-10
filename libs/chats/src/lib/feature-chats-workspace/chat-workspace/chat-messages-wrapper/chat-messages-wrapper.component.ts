import {
  OnChanges,
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren, computed, ChangeDetectionStrategy,
} from '@angular/core';
import {debounceTime, fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {PostInputComponent} from '@tt/posts';
import {Chat, ChatService} from '@tt/data-access/chats';

@Component({
  selector: 'app-chat-messages-wrapper',
  imports: [ChatMessageComponent, PostInputComponent],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessagesWrapperComponent implements OnChanges, AfterViewInit {
  private readonly PADDING = 24;

  chatService = inject(ChatService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef);

  chat = input.required<Chat>();

  messages = computed(() => this.chatService.activeChats()[this.chat().id] ?? []);

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLElement>;
  @ViewChildren('lastMessage') lastMessage?: QueryList<ElementRef<HTMLElement>>;

  ngOnChanges() {
    this.chatService.setCurrentChatId(this.chat().id)
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
    const {top} = el.getBoundingClientRect();
    const height = window.innerHeight - top - this.PADDING;

    this.r2.setStyle(el, 'height', `${height}px`);
  }

  onSendMessage(messageText: string) {
    this.chatService.wsAdapter.sendMessage(messageText, this.chat().id)
  }
}
