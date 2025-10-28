import {Post} from "../index";
import {createFeature, createReducer, on} from '@ngrx/store';
import {postActions} from "./actions";

interface PostState {
  posts: Post[]
}

const initialState: PostState = {
  posts: []
}

export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialState,
    on(postActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts
      }
    })
  )
})
