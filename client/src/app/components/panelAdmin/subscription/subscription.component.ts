import { Component, OnInit } from '@angular/core';
import { ApiClientService, API_URI_OFFER } from 'src/app/api-client/api-client.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  offers: any[];
  selectedOffer: any;
  ownedOffer: any;
  inProgress = false;

  constructor(
    private apiClientService: ApiClientService,
    private accountService: AccountService) {
      this.accountService.offer
        .subscribe(
          (off) => this.ownedOffer = off,
          (err) => {}
        );
    }

  ngOnInit() {
    this.apiClientService.get(API_URI_OFFER)
      .subscribe(
        (off) => {
          this.offers = off.filter(o => o.enabled);
          this.offers[0].selected = true;
          this.selectedOffer = this.offers[0];
        },
        (err) => {

        }
      );
      this.accountService.loadOffer();
  }
  /**
   *
   */
  selectOffer(offer: any) {
    this.offers.forEach(o => o.selected = o.id === offer.id);
    this.selectedOffer = offer;
  }

}
