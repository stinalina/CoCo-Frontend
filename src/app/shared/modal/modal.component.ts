import { Component, input } from '@angular/core';

@Component({
  selector: 'coco-modal',
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.scss',
})
export class ModalComponent {
  public readonly modalId = input.required<string>();
}