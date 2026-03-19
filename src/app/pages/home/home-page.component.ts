import { Component } from '@angular/core';
import { ROUTER_TOKENS } from '@app/app.routes';
import { CreateTripInfoComponent } from '@app/shared/create-trip-info/create-trip-info.component';

@Component({
  selector: 'coco-home-page',
  templateUrl: 'home-page.component.html',
  imports: [
    CreateTripInfoComponent,
  ],
})
export class HomePage {
  public readonly RouterTokens = ROUTER_TOKENS;
}