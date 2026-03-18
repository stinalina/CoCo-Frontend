import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResponseStreamChunk, TravelAgentService } from '@app/services/travel-agent.service';
import { LocalStorageService } from '@services/local-storage.service';
import { SESSION_STORAGE } from '@shared/storage.token';
import { finalize, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly sessionStorage = inject(SESSION_STORAGE);
  private readonly localStorageService = inject(LocalStorageService);

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
      takeUntilDestroyed(this.destroyRef),
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
