import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post, PostComment} from '../index';
import {map, switchMap} from 'rxjs';
import {baseApiUrl} from '@tt/shared';
import {CommentCreateDto, PostCreateDto} from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${baseApiUrl}post/`, payload)
      .pipe(
        switchMap(() => this.fetchPosts())
      )
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${baseApiUrl}post/`);
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${baseApiUrl}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.#http.get<Post>(`${baseApiUrl}post/${postId}`)
      .pipe(
        map((res) => res.comments)
      )
  }

}
