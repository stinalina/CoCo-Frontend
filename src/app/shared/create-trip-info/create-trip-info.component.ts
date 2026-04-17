import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '@app/services/local-storage.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { ResponseStreamChunk, TravelAgentService } from '@app/services/travel-agent.service';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { TextFrameComponent } from '@app/shared/text-frame/text-frame.component';
import { catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'coco-create-trip-info',
  templateUrl: 'create-trip-info.component.html',
  styleUrl: 'create-trip-info.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    TextFrameComponent,
    ReactiveFormsModule
] 
})
export class CreateTripInfoComponent  {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly travelAgentService = inject(TravelAgentService);
  public responseChunks = signal<ResponseStreamChunk[]>([]);

  protected readonly sendingNotification = signal<boolean>(false);
  protected readonly tripInfoAvailable = signal<boolean>(false);

  protected readonly fb = inject(FormBuilder);
  protected readonly myForm = this.fb.group({
    initialQuestion: ['', Validators.required],
    startDate: [''],
    endDate: [''],
    mail: [this.localStorageService.getUserMail() ?? '', Validators.email]
  });

  protected readonly formStatus = toSignal(this.myForm.statusChanges, {
    initialValue: this.myForm.status,
  });
  public readonly canSubmitForm = computed(() =>  {
    return this.formStatus() === 'VALID';
  });

  public readonly responseText = computed(() => {
    return this.responseChunks()
      .map(chunk => chunk.text || '')
      .join('\n');
  });

  public startConversation(): void {
    const conversationStart = this.myForm.get('initialQuestion')?.value;
    if (!conversationStart) {
      return;
    }
    this.sendingNotification.set(true);
    this.tripInfoAvailable.set(false);
    this.responseChunks.set([]);
    
    this.toastService.showToast('Ihre Reise wird erstellt.', ToastType.Info);
    this.travelAgentService.streamConversation(conversationStart).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        this.toastService.showToast('Ihre Reise konnte nicht erstellt werden.', ToastType.Error);
        console.error(error);
        return EMPTY;
      }),
      finalize(() => {
        this.sendingNotification.set(false);
      })
    ).subscribe(
      chunk => {
        if (chunk.isCompleted) {
          this.toastService.showToast('Ihre Reise wurde erfolgreich erstellt.', ToastType.Success);
          this.tripInfoAvailable.set(true);
          return;
        }

        this.responseChunks.update(chunks => [...chunks, chunk]);
      }
    );
  }
}
