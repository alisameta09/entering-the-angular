import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap, withLatestFrom} from 'rxjs';
import {profileActions} from './actions';
import {ProfileService, selectProfilePageable, selectSaveFilteredProfiles} from '../index';
import {Store} from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);
  store = inject(Store);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        profileActions.filterProfiles,
        profileActions.setPage
      ),
      withLatestFrom(
        this.store.select(selectSaveFilteredProfiles),
        this.store.select(selectProfilePageable)
      ),
      switchMap(([_, filters, pageable]) => {
        return this.profileService.filterProfiles({
          ...filters,
          ...pageable
        })
      }),
      map(res => profileActions.profilesLoaded({profiles: res.items}))
    )
  })
}
