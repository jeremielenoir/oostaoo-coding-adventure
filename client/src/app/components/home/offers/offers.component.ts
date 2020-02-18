import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_OFFER } from 'src/app/api-client/api-client.service';
import { Offer } from 'src/app/models/offer.model';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  handler: any = null;
  offerChoiceAmount: number = null;
  subscriptionPage = false;
  listOffers: Offer[] = [];


  constructor(private router: Router,
              private apiClientService: ApiClientService,
              private session: SessionService
    ) { }

    ngOnInit() {
      // recuperation l'offre selectionné
      // this.offerChoiceAmount = this.session.offerChoiceAmount ? this.session.offerChoiceAmount : null;
      this.offerChoiceAmount = +localStorage.getItem('offerChoiceAmount') || null;

      // savoir si on est sur la page home ou sur la page abonnement interne (log)
      this.subscriptionPage = this.router.url.startsWith('/subscription');

      // recuperation offres back
      this.apiClientService.get(API_URI_OFFER).subscribe( offers => {
        console.log('offers :', offers);
        offers.forEach(offer => {
          offer.description = offer.description.split('$');
          this.listOffers.push(offer);
        });
      },
        err => console.log
      );
    }

    gotToLoginOrDashboardPage(offer) {
      // changement d'offre
      localStorage.setItem('offerChoiceAmount' , offer.price);
      // this.session.offerChoiceAmount = offer.price;
      this.offerChoiceAmount = offer.price;

      if (offer.price === 0 && this.subscriptionPage) {
        // version gratuite
        this.router.navigate(['/dashboard/campaigns']);
      } else {
        if (this.router.url.startsWith('/subscription')) {
          console.log('Nous sommes sur abonnement interne');
          // traitement user back
          // this.session.offerChoice = offer;
          localStorage.setItem('offerChoice', JSON.stringify(offer));

          this.router.navigate(['/stripePayment']);
        } else {
          console.log('Nous sommes sur abonnement home');
          this.router.navigate(['/home/register']);
        }
      }
    }

}
