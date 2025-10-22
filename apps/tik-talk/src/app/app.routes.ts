import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { FormsExperimentComponent } from './experimental/forms-experiment/forms-experiment.component';
import {canActivateAuth, LoginPageComponent} from '@tt/auth';
import { ProfilePageComponent, SettingsPageComponent } from '@tt/profile';
import {chatsRoutes} from '@tt/chats';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'search', component: SearchPageComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'experimental', component: FormsExperimentComponent },
];
