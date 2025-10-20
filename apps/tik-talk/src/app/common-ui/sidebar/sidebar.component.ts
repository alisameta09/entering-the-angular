import { Component, inject, OnInit } from '@angular/core';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {ProfileService} from '@tt/profile';

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
  subscribers$ = this.profileService.getSubscribersShortList();
  me = this.profileService.me;

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

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe());
  }
}
