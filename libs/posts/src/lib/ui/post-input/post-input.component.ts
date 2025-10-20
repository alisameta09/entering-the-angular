import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2,
} from '@angular/core';
import { ProfileService } from '@tt/profile';
import { FormsModule } from '@angular/forms';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  profile = inject(ProfileService).me;

  isCommentInput = input<boolean>(false);
  postId = input<number>(0);

  postText = '';

  @Output() postCreated = new EventEmitter();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onPostSend() {
    if (this.postText.trim()) {
      this.postCreated.emit(this.postText);
      this.postText = '';
    }
  }
}
