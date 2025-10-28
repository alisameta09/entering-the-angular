import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Post} from '../index';

export const postActions = createActionGroup({
  source: 'posts',
  events: {
    'fetch events': emptyProps(),
    'posts loaded': props<{ posts: Post[] }>()
  }
})
