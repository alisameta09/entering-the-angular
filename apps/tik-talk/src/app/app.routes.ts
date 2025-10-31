import {Routes} from '@angular/router';
import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {canActivateAuth, LoginPageComponent} from '@tt/auth';
import {ProfilePageComponent, SearchPageComponent, SettingsPageComponent} from '@tt/profile';
import {chatsRoutes} from '@tt/chats';
import {LayoutComponent} from '@tt/layout';
import {FormsExperimentComponent} from '@tt/experimental';
import {ProfileEffects, profileFeature} from '@tt/data-access/profile';
import {PostEffects, postFeature} from '@tt/data-access/posts';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postFeature),
          provideEffects(PostEffects)
        ]
      },
      {path: 'settings', component: SettingsPageComponent},
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  {path: 'login', component: LoginPageComponent},
  {path: 'experimental', component: FormsExperimentComponent},
];
