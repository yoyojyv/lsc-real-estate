import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { IRouting } from './shared/interfaces';
import {UserEditComponent} from './users/user-edit.component';
import {PropertiesComponent} from './properties/properties.component';
import {PropertyDetailComponent} from './properties/property-detail.component';
import {SigninComponent} from './auth/signin.component';
import {AuthGuard} from './core/auth.guard';
import {HomeComponent} from './home/home.component';
import {HeaderNavComponent} from './header-nav.component';
import {PropertyEditComponent} from './properties/property-edit.component';

const routes: Routes = [
  { path: '', component: PropertiesComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SigninComponent },
  { path: 'logout', component: SigninComponent },
  { path: 'properties', component: PropertiesComponent, canActivate: [AuthGuard]},
  { path: 'properties/new', component: PropertyEditComponent, canActivate: [AuthGuard] },
  { path: 'properties/:id', component: PropertyDetailComponent, canActivate: [AuthGuard] },
  { path: 'properties/:id/edit', component: PropertyEditComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/new', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'users/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch:'full', redirectTo: '/properties' }
];
// //catch any unfound routes and redirect to home page

export const appRouting: IRouting = {
  routes: RouterModule.forRoot(routes),
  components: [ HomeComponent, HeaderNavComponent, SigninComponent,
    PropertiesComponent, PropertyDetailComponent, PropertyEditComponent,
    UsersComponent, UserEditComponent ]
};
