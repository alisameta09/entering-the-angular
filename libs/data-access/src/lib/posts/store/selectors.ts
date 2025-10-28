import {createSelector} from '@ngrx/store';
import { postFeature } from './reducer';

export const selectFetchedPosts = createSelector(
  postFeature.selectPosts,
  (posts) => posts
)
