import { inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE } from "@shared/storage.token";

@Injectable ({ providedIn: 'root' })
export class LocalStorageService {
  private readonly stoarge = inject(LOCAL_STORAGE);

  private readonly USER_MAIL_TOKEN = 'user_mail';
  private readonly SENDED_NOTIFICATIONS_COUNT_TOKEN = 'sended_notifications_count';

  public getUserMail(): string | null {
    return this.stoarge.getItem(this.USER_MAIL_TOKEN);
  }

  public setUserMail(value: string): void {
    this.stoarge.setItem(this.USER_MAIL_TOKEN, value);
  }

  public getSendedNotificationCount(): number {
    const value = this.stoarge.getItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN)?.split('_');
    if (value) {
      let month = new Date().getMonth();
      const lastMonth = Number(value[1]);
      if (month !== lastMonth) {
        this.stoarge.setItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN, `0_${month}`);
        return 0;
      }
      return Number(value[0]);
    }
    return 0
  }

  /**
   * Count will be reseted when new month starts
   * @param limit - default is 3; count won't increase when limit is reached
   */
  public increaseSendedNotificationCount(limit: number = 3): void {
    const value = this.stoarge.getItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN)?.split('_');
    let count = 1;
    let month = new Date().getMonth();
    if (value) {
      const lastMonth = Number(value[1]);
      count =  Number(value[0]);
      if (month === lastMonth && count < limit) {
        count++;
      }
    }
    
    const newValue = `${count}_${month}`;
    this.stoarge.setItem(this.SENDED_NOTIFICATIONS_COUNT_TOKEN, newValue);
  }
}