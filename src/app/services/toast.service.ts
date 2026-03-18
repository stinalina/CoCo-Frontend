import { Injectable, signal } from '@angular/core';

export enum ToastType {
  Error, Success, Info, Warning
}

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public readonly toastIds = signal<Toast[]>([]);
  private idCounter: number = 0;

  public showToast(message: string, type: ToastType, life: number = 5000): void {
    const id = ++this.idCounter;
    const toast = {
      id,
      type,
      message
    } satisfies Toast;
    this.toastIds.update(old => [...old, toast]);
    setTimeout((): void => this.remove(id), life);
  }

  private remove(id: number): void {
    this.toastIds.set(this.toastIds().filter((toast): boolean => toast.id !== id));
  }
}