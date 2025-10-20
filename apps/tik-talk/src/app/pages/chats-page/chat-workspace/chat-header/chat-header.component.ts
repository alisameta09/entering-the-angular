import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../../../../../../libs/common-ui/src/lib/components/avatar-circle/avatar-circle.component';
import { Profile } from '../../../../../../../../libs/profile/src/lib/data/interfaces/profile.interface';
import { SvgIconComponent } from '../../../../../../../../libs/common-ui/src/lib/components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-chat-header',
  imports: [AvatarCircleComponent, SvgIconComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
  profile = input.required<Profile>();
}
