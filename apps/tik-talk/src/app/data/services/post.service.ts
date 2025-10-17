import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface';
import { map, switchMap, tap } from 'rxjs';
import { baseApiUrl } from '../../../const';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);

  posts = signal<Post[]>([]);

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${baseApiUrl}post/`, payload).pipe(
      switchMap(() => {
        return this.fetchPosts();
      })
    );
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${baseApiUrl}post/`).pipe(tap((res) => this.posts.set(res)));
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${baseApiUrl}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.#http.get<Post>(`${baseApiUrl}post/${postId}`).pipe(map((res) => res.comments));
  }
}
