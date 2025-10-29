import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs';
import {postActions} from './actions';
import {PostService} from '../index';

@Injectable({
  providedIn: 'root'
})
export class PostEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createPost),
      switchMap(({payload}) => this.postService.createPost(payload)),
      map(() => postActions.fetchPosts())
    )
  })

  fetchPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.fetchPosts),
      switchMap(() => this.postService.fetchPosts()),
      map(posts => postActions.postsLoaded({posts}))
    )
  })

}
