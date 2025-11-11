import {createActionGroup, props} from '@ngrx/store';
import {Profile} from '../index';

export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'save filter': props<{ filters: Record<string, any> }>(),
    'filter profiles': props<{ filters: Record<string, any> }>(),
    'profiles loaded': props<{ profiles: Profile[] }>(),
    'set page': props<{ page?: number }>()
  }
})
