import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      //  if (!environment.production && environment.HASURA_ADMIN_SECRET !== '') {
      //   headers = new HttpHeaders({ 'x-hasura-admin-secret': environment.HASURA_ADMIN_SECRET });
      // }
      return {
        link: httpLink.create({ uri: 'http://localhost:8081/v1/graphql' }), //headers inside here
        cache: new InMemoryCache()
      };
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding())
  ]
};
