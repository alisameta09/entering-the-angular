import {AfterViewInit, Component, DestroyRef, ElementRef, inject, Renderer2} from '@angular/core';
import {PostInputComponent} from '../post-input/post-input.component';
import {PostComponent} from '../post/post.component';
import {PostService} from '../../../data/services/post.service';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProfileService} from '../../../data/services/profile.service';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit {
  PADDING = 24 * 2;

  r2 = inject(Renderer2)
  postService = inject(PostService);
  profile = inject(ProfileService).me;
  hostElement = inject(ElementRef);

  feed = this.postService.posts;
  destroyRef = inject(DestroyRef);

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.resizeFeed())
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - this.PADDING;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  async onCreatePost(postText: string) {
    if (!postText.trim()) return;

    await firstValueFrom(this.postService.createPost({
      title: 'Клевый пост',
      content: postText.trim(),
      authorId: this.profile()!.id,
      communityId: 0
    }))
  }

}
