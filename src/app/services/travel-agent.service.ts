import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

export type ResponseStreamChunk = {
  authorName?: string;
  text?: string;
  isCompleted: boolean;
}

@Injectable ({ providedIn: 'root' })
export class TravelAgentService {
  private readonly url = environment.BACKEND_URL + '/conversation/stream';

  public readonly httpClient = inject(HttpClient);

  public streamConversation(question: string): Observable<ResponseStreamChunk> {
    return new Observable((observer) => {
      this.streamWithFetch(question, observer);
      return () => {};
    });
  }

  private async streamWithFetch(
    question: string,
    observer: any
  ): Promise<void> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        observer.error(new Error('No response body'));
        return;
      }

      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            try {
              const jsonStr = trimmed.slice(5).trim();
              const chunk: ResponseStreamChunk = JSON.parse(jsonStr);

              if (chunk.text?.includes('Error:')) {
                observer.error(new Error(chunk.text));
                return;
              }

              observer.next(chunk);

              if (chunk.isCompleted) {
                observer.complete();
                return;
              }
            } catch (error) {
              console.error('Failed to parse chunk:', error, 'Line:', trimmed);
              observer.error(new Error(`Failed to parse chunk: ${error}`));
              return;
            }
          }
        }
      }

      observer.complete();
    } catch (error) {
      observer.error(error);
    }
  }
}