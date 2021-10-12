import { Injectable } from '@angular/core';
import {
  ApiClientService,
  API_URI_ACCOUNT,
} from '../../api-client/api-client.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerAccount } from 'src/app/models/account.model';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { subscriptions, paymentIntents } from 'stripe';
import { catchError, filter, map, tap } from 'rxjs/operators';
import ErrorConfig from 'src/app/components/common/config/Error';
import { Offer } from 'src/app/models/offer.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  /**
   *
   */
  accountId: number;

  private _subscription: BehaviorSubject<subscriptions.ISubscription> =
    new BehaviorSubject(null);
  public readonly subscription: Observable<subscriptions.ISubscription> =
    this._subscription.asObservable();
  /**
   *
   * @param httpService
   */
  constructor(
    private httpService: ApiClientService,
    private decryptTokenService: DecryptTokenService,
  ) {
    this.accountId = this.decryptTokenService.decodedValue.customeraccount;
  }
  /**
   *
   */
  loadAccount(): Observable<CustomerAccount> {
    return this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}`).pipe(
      tap((acc) => console.log('loadAccount: ' + JSON.stringify(acc))),
      catchError(ErrorConfig.handleError(this.accountId)),
    );
  }
  /**
   *
   */
  loadPaymentMethod(): Observable<any> {
    return this.httpService
      .get(`${API_URI_ACCOUNT}/${this.accountId}/payments-methods`)
      .pipe(
        tap((pay) => console.log('loadPaymentMethod: ' + JSON.stringify(pay))),
        catchError(ErrorConfig.handleError(this.accountId)),
      );
  }
  /**
   *
   */
  loadSubscription(): Observable<any> {
    return this.httpService
      .get(`${API_URI_ACCOUNT}/${this.accountId}/subscriptions`)
      .pipe(
        tap((sub) => console.log('loadSubscription: ' + JSON.stringify(sub))),
        catchError(ErrorConfig.handleError(this.accountId)),
      );
  }
  /**
   *
   */
  loadOffer(): Observable<Offer> {
    return this.httpService
      .get(`${API_URI_ACCOUNT}/${this.accountId}/offers`)
      .pipe(
        tap((off) => console.log('loadOffer: ' + JSON.stringify(off))),
        catchError(ErrorConfig.handleError(this.accountId)),
      );
  }
  /**
   *
   */
  loadInvoices(): Observable<any> {
    return this.httpService
      .get(`${API_URI_ACCOUNT}/${this.accountId}/invoices`)
      .pipe(
        tap((inv) => console.log('loadInvoices: ' + JSON.stringify(inv))),
        catchError(ErrorConfig.handleError(this.accountId)),
      );
  }
  /**
   *
   */
  cancelSubscription(sub) {
    return this.httpService
      .delete(`${API_URI_ACCOUNT}/${this.accountId}/subscriptions/${sub.id}`)
      .pipe(
        map((res) => {
          this._subscription.next(res.subscription);
          this.loadAccount();
          this.loadOffer();
        }),
      );
  }
  /**
   *
   */
  enableSubscription(sub) {
    return this.httpService
      .get(
        `${API_URI_ACCOUNT}/${this.accountId}/subscriptions/${sub.id}/enable`,
      )
      .pipe(
        map((res) => {
          this._subscription.next(res.subscription);
          this.loadAccount();
          this.loadOffer();
        }),
      );
  }
}
