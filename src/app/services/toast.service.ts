import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type?: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  message$ = new BehaviorSubject<ToastMessage | null>(null);
  isLeaving$ = new BehaviorSubject(false);

  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  private show(message: string, type: 'success' | 'error'): void {
    this.clearTimer();
    this.isLeaving$.next(false);
    this.message$.next({ message, type });
    this.scheduleDismiss();
  }

  dismiss(): void {
    if (!this.message$.value) {
      return;
    }

    this.clearTimer();
    this.isLeaving$.next(true);

    setTimeout(() => {
      this.message$.next(null);
      this.isLeaving$.next(false);
    }, 220);
  }

  private scheduleDismiss(): void {
    this.dismissTimer = setTimeout(() => {
      this.dismiss();
    }, 3000);
  }

  private clearTimer(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
}