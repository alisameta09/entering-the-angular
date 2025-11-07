import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {firstValueFrom, Subscription, timer} from 'rxjs';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {ProfileService} from '@tt/data-access/profile';
import {ChatService, isErrorMessage} from '@tt/data-access/chats';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthService} from '@tt/data-access/auth';

@Component({
  selector: 'app-sidebar',
  imports: [
    SvgIconComponent,
    SubscriberCardComponent,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  #chatService = inject(ChatService);
  destroyRef = inject(DestroyRef);
  #authService = inject(AuthService);

  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.profileService.me;
  unreadMessages = this.#chatService.unreadMessagesCount

  wsSubscribe!: Subscription;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
    {
      label: 'Эксперименты',
      icon: 'experimental',
      link: 'experimental',
    },
  ];

  async reconnect() {
    await firstValueFrom(this.profileService.getMe());
    await firstValueFrom(timer(2000));

    this.connect();
  }

  connect() {
    this.wsSubscribe?.unsubscribe();

    this.wsSubscribe = this.#chatService.connectWs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(message => {
        if (isErrorMessage(message) && message.message === 'Invalid token') {
          this.reconnect()
        }
      });
  }

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe());

    this.connect();
  }
}
