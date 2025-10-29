import {Post, PostComment} from "../index";
import {createFeature, createReducer, on} from '@ngrx/store';
import {postActions} from "./actions";

interface PostState {
  posts: Post[],
  comments: Record<number, PostComment[]>,
}

const initialState: PostState = {
  posts: [],
  comments: {}
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
    }),
    on(postActions.commentsLoaded, (state, {comments}) => {
      const stateComments = {...state.comments}

      if (comments.length) {
        stateComments[comments[0].postId] = comments
      }

      return {
        ...state,
        comments: stateComments
      }
    })
  )
})
