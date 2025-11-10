import {ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal} from '@angular/core';
import {Post, postActions, PostComment, selectCreatedComments} from '@tt/data-access/posts';
import {CommentComponent, PostInputComponent} from '../../ui';
import {AvatarCircleComponent, DateTransformPipe, SvgIconComponent} from '@tt/common-ui';
import {GlobalStoreService} from '@tt/data-access/profile';
import {Store} from '@ngrx/store';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  post = input<Post>();
  comments!: Signal<PostComment[]>

  profile = inject(GlobalStoreService).me;
  store = inject(Store);

  comments2 = computed(() => {

    if (this.comments()?.length) {
      return this.comments()
    }

    return this.post()?.comments
  })


  ngOnInit() {
    this.comments = this.store.selectSignal(selectCreatedComments(this.post()!.id));
  }

  onCreateComment(commentText: string) {
    if (!commentText.trim()) return;

    this.store.dispatch(postActions.createComment({
      payload: {
        text: commentText,
        authorId: this.profile()!.id,
        postId: this.post()!.id,
      }
    }))
  }
}
