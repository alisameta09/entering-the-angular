import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs';
import {profileActions} from './actions';
import {ProfileService} from '../index';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({filters}) => {
        return this.profileService.filterProfiles(filters)
      }),
      map(res => profileActions.profilesLoaded({profiles: res.items}))
    )
  })
}
