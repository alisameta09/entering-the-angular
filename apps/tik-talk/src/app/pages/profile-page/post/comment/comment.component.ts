import { Component, input } from '@angular/core';
import { PostComment } from '../../../../data/interfaces/post.interface';
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { DateTransformPipe } from '../../../../helpers/pipes/date-transform.pipe';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DateTransformPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
