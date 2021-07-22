import { Injectable } from '@angular/core';
import { ApiClientService, API_URI_ACCOUNT } from '../../api-client/api-client.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerAccount } from 'src/app/models/account.model';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { invoices, subscriptions, paymentIntents } from 'stripe';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  /**
   *
   */
  accountId: number;
  /**
   *
   */
  private _account: BehaviorSubject<CustomerAccount> = new BehaviorSubject(null);
  public readonly account: Observable<CustomerAccount> = this._account.asObservable();
  /**
   *
   */
  private _paymentMethod: BehaviorSubject<paymentIntents.IPaymentIntent> = new BehaviorSubject(null);
  public readonly paymentMethod: Observable<paymentIntents.IPaymentIntent> = this._paymentMethod.asObservable();
  /**
   *
   */
  private _subscription: BehaviorSubject<subscriptions.ISubscription> = new BehaviorSubject(null);
  public readonly subscription: Observable<subscriptions.ISubscription> = this._subscription.asObservable();
  /**
   *
   */
  private _offer: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly offer: Observable<any> = this._offer.asObservable();
  /**
   *
   */
  private _invoices: BehaviorSubject<invoices.IInvoice[]> = new BehaviorSubject(null);
  public readonly invoices: Observable<invoices.IInvoice[]> = this._invoices.asObservable();
  /**
   *
   * @param httpService
   */
  constructor(
    private httpService: ApiClientService,
    private decryptTokenService: DecryptTokenService
  ) {
    this.accountId = this.decryptTokenService.decodedValue.customeraccount;
    this.loadAccount();
  }
  /**
   *
   */
  loadAccount() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}`)
      .subscribe(
        (acc) => this._account.next(acc),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  loadPaymentMethod() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/paymentsmethods`)
      .subscribe(
        (pm) => this._paymentMethod.next(pm),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  loadSubscription() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/subscriptions`)
      .subscribe(
        (sub) => {
          this._subscription.next(sub);
          this.loadOffer();
        },
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  loadOffer() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/offers`)
      .subscribe(
        (off) => this._offer.next(off),
        (err) => {
          // TODO show message fail to load account
          console.log("err load offer",err)
        }
      );
  }
  /**
   *
   */
  loadInvoices() {
    this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/invoices`)
      .subscribe(
        (inv) => this._invoices.next(inv),
        (err) => {
          // TODO show message fail to load account
        }
      );
  }
  /**
   *
   */
  cancelSubscription() {
    return this.httpService.delete(`${API_URI_ACCOUNT}/${this.accountId}/subscriptions/${this._subscription.value.id}`)
      .pipe(
        map(res => {
          this._subscription.next(res.subscription);
          this.loadAccount();
          this.loadOffer();
        })
      );
  }
  /**
   *
   */
  enableSubscription() {
    return this.httpService.get(`${API_URI_ACCOUNT}/${this.accountId}/subscriptions/${this._subscription.value.id}/enable`)
      .pipe(
        map(res => {
          this._subscription.next(res.subscription);
          this.loadAccount();
          this.loadOffer();
        })
      );
  }
}
