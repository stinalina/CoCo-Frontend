import { Component, input } from '@angular/core';

@Component({
  selector: 'reme-checkbox',
  templateUrl: 'checkbox.component.html'
})
export class CheckboxComponent {
  public readonly preId = input.required<string>();
}