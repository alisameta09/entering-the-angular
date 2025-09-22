import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Post, PostComment} from '../../../data/interfaces/post.interface';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {PostInputComponent} from '../post-input/post-input.component';
import {CommentComponent} from './comment/comment.component';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {DateTransformPipe} from '../../../helpers/pipes/date-transform.pipe';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    DateTransformPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post = input<Post>();

  comments = signal<PostComment[]>([])

  postService = inject(PostService);

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated() {
    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );

    this.comments.set(comments);
  }
}
