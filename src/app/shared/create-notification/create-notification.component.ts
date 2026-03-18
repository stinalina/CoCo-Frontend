import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ToastService, ToastType } from '@app/services/toast.service';
import { ResponseStreamChunk, TravelAgentService } from '@app/services/travel-agent.service';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';

@Component({
  selector: 'reme-create-notification',
  templateUrl: 'create-notification.component.html',
  styleUrl: 'create-notification.component.scss',
  imports: [
    CommonModule,
    FormsModule
  ] 
})
export class CreateNotificationComponent  {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  private readonly travelAgentService = inject(TravelAgentService);
  public initialQuestion: string = '';

  public chunks$: Observable<ResponseStreamChunk> | null = null;

  protected readonly now = this.nextDay;
  protected readonly sendingNotification = signal<boolean>(false);

  private get nextDay(): string {
    const date = new Date();
    const dateTime = new Date(date.getTime() + 24 * 60 * 60 * 1000); // add one day
    return new DatePipe('en-US').transform(dateTime, 'yyyy-MM-dd')!;
  }

  public startConversation(): void {
    this.sendingNotification.set(true);

    var currentAuthor: string = 'Unknown';
    var answer: string = '';
    
    this.travelAgentService.streamConversation(this.initialQuestion).pipe(
      tap(() => this.toastService.showToast('Ihre Reise wird erstellt.', ToastType.Info)),
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
        }
        answer += chunk.text;
      }
    );
  }
}
