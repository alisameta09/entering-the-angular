import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {Profile} from "@tt/data-access/profile";

@Component({
  selector: 'app-chat-header',
  imports: [AvatarCircleComponent, SvgIconComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHeaderComponent {
  profile = input.required<Profile>();
}
