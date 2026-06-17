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

  success(message: string): void {
    this.message$.next({
      message,
      type: 'success'
    });
    this.clear();
  } 

  error(message: string): void {
    this.message$.next({
      message,
      type: 'error'
    });
    this.clear();
  }

private clear(): void {
  setTimeout(() => {
    this.message$.next(null);
    }, 3000);
  }
}