import { Component, input } from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {Profile} from '../../../../../../profile/src/lib/data/interfaces';

@Component({
  selector: 'app-chat-header',
  imports: [AvatarCircleComponent, SvgIconComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
  profile = input.required<Profile>();
}
