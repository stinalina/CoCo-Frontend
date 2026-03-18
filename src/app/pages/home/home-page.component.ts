import { Component } from '@angular/core';
import { ROUTER_TOKENS } from '@app/app.routes';
import { CreateNotificationComponent } from '@shared/create-notification/create-notification.component';

@Component({
  selector: 'reme-home-page',
  templateUrl: 'home-page.component.html',
  imports: [
    CreateNotificationComponent,
  ],
})
export class HomePage {
  public readonly RouterTokens = ROUTER_TOKENS;
}