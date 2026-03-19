import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '@app/services/local-storage.service';
import { ToastService, ToastType } from '@app/services/toast.service';
import { TravelAgentService } from '@app/services/travel-agent.service';
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
  //public initialQuestion: string = '';
  public responseText = signal<string>('');

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

  public startConversation(): void {
    const conversationStart = this.myForm.get('initialQuestion')?.value;
    if (!conversationStart) {
      return;
    }
    this.sendingNotification.set(true);
    this.tripInfoAvailable.set(false);
    this.responseText.set(''); 

    var currentAuthor: string = 'Unknown';
    var answer: string = '';
    
    this.toastService.showToast('Ihre Reise wird erstellt.', ToastType.Info);
    this.travelAgentService.streamConversation(conversationStart).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        this.toastService.showToast('Ihre Reise konnte nicht erstellt werden.', ToastType.Error);
        console.log(error);
        return EMPTY;
      }),
      finalize(() => {
        console.log(answer);
        this.sendingNotification.set(false)
      })
    ).subscribe(
      chunk => {
        if (chunk.authorName && chunk.authorName !== currentAuthor) {
          console.log(answer);
          answer = '';
          currentAuthor = chunk.authorName;
          console.log('\n');
          console.log(currentAuthor + ': ');
          this.responseText.update(text => 
            text + (text ? '\n\n' : '') + `${currentAuthor}:\n`
          );
        }
        answer += chunk.text;
        this.responseText.update(text => text + chunk.text);

        if (chunk.isCompleted) {
          this.toastService.showToast('Ihre Reise wurde erfolgreich erstellt.', ToastType.Success);
          this.tripInfoAvailable.set(true); 
        }
      }
    );
  }
}
