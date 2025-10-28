import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs';
import { postActions } from './actions';
import { PostService } from '../index';

@Injectable({
  providedIn: 'root'
})
export class PostEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  fetchPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.fetchEvents),
      switchMap(() => this.postService.fetchPosts()),
      map(res => postActions.postsLoaded({posts: res}))
    )
  })
}
