import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiClientService,
  API_URI_OFFER
} from 'src/app/api-client/api-client.service';
import { Offer } from 'src/app/models/offer.model';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  handler: any = null;
  offerChoiceAmount: string;
  isSubPage = false;
  listOffers: Offer[] = [];

  constructor(
    private router: Router,
    private apiClientService: ApiClientService,
    private session: SessionService
  ) {}
  /**
   *
   */
  ngOnInit() {
    // this.offerChoiceAmount = this.session.offerChoiceAmount ? this.session.offerChoiceAmount : null;
    this.offerChoiceAmount = localStorage.getItem('offerChoiceAmount');
    this.isSubPage = this.router.url.startsWith('/subscription');
    this.apiClientService.get(API_URI_OFFER)
      .subscribe(offers => this.listOffers = offers.filter((o: Offer) => o.enabled));
  }
  /**
   *
   */
  goToPay(offer: Offer) {
    localStorage.setItem('offerChoiceAmount', '' + offer.price);
    this.offerChoiceAmount = '' + offer.price;
    if (this.router.url.startsWith('/subscription')) {
      localStorage.setItem('offerChoice', JSON.stringify(offer));
      this.router.navigate(['/payment']);
    } else {
      this.router.navigate(['/home/register']);
    }
  }

}
