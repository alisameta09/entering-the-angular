import { Component, input } from '@angular/core';
import {AvatarCircleComponent, DateTransformPipe} from '@tt/common-ui';
import {PostComment} from '../../data';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DateTransformPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
