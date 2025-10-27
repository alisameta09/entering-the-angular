import {Routes} from '@angular/router';
import {provideState} from '@ngrx/store';
import {canActivateAuth, LoginPageComponent} from '@tt/auth';
import {ProfilePageComponent, SearchPageComponent, SettingsPageComponent} from '@tt/profile';
import {chatsRoutes} from '@tt/chats';
import {LayoutComponent} from '@tt/layout';
import {FormsExperimentComponent} from '@tt/experimental';
import {ProfileEffects, profileFeature} from '@tt/data-access/profile';
import {provideEffects} from '@ngrx/effects';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {path: 'profile/:id', component: ProfilePageComponent},
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
