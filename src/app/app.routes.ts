import { Routes } from '@angular/router';
import { HomePage } from '@pages/home/home-page.component';

export enum ROUTER_TOKENS {
  HOME = 'home',
}

export const routes: Routes = [
  {
    path: ROUTER_TOKENS.HOME,
    component: HomePage,
  },
  {
    path: '',
    redirectTo: ROUTER_TOKENS.HOME,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: ROUTER_TOKENS.HOME,
  },
];
