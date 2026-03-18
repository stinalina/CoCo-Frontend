
import { Component, inject } from "@angular/core";
import { ToastService, ToastType } from "@services/toast.service";

@Component({
  'selector': 'reme-toast',
  templateUrl: './toast.component.html',
  imports: [],
})
export class ToastComponent {
  public readonly toastService = inject(ToastService);
  public readonly ToastType = ToastType;
}