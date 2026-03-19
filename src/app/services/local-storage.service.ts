import { inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE } from "@shared/storage.token";

@Injectable ({ providedIn: 'root' })
export class LocalStorageService {
  private readonly stoarge = inject(LOCAL_STORAGE);

  private readonly USER_MAIL_TOKEN = 'user_mail';

  public getUserMail(): string | null {
    return this.stoarge.getItem(this.USER_MAIL_TOKEN);
  }

  public setUserMail(value: string): void {
    this.stoarge.setItem(this.USER_MAIL_TOKEN, value);
  }
}