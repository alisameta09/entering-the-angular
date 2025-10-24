import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {Post, PostComment, PostService} from '../../data';
import {CommentComponent, PostInputComponent} from '../../ui';
import {AvatarCircleComponent, DateTransformPipe, SvgIconComponent} from '@tt/common-ui';
import {GlobalStoreService} from '@tt/shared';

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
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();

  comments = signal<PostComment[]>([]);

  postService = inject(PostService);
  profile = inject(GlobalStoreService).me;

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreateComment(commentText: string) {
    if (!commentText.trim()) return;

    await firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.profile()!.id,
        postId: this.post()!.id,
      })
    );

    const createdComments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );

    this.comments.set(createdComments);
  }
}
