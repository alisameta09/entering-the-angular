import { AfterViewInit, Component, DestroyRef, ElementRef, inject, Renderer2 } from '@angular/core';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {PostService} from '@tt/data-access/posts';
import {PostInputComponent} from '../../ui';
import {PostComponent} from '../post';
import {GlobalStoreService} from '@tt/data-access/profile';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
  private readonly PADDING = 24 * 2;

  r2 = inject(Renderer2);
  postService = inject(PostService);
  profile = inject(GlobalStoreService).me;
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef);

  feed = this.postService.posts;

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizeFeed());
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - this.PADDING;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  async onCreatePost(postText: string) {
    if (!postText.trim()) return;

    await firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText.trim(),
        authorId: this.profile()!.id,
        communityId: 0,
      })
    );
  }
}
