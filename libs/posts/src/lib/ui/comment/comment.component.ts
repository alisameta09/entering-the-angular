import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {AvatarCircleComponent, DateTransformPipe} from '@tt/common-ui';
import {PostComment} from '@tt/data-access/posts';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DateTransformPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  comment = input<PostComment>();
}
