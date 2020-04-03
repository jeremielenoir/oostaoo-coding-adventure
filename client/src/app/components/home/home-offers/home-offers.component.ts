import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_OFFER } from 'src/app/api-client/api-client.service';

@Component({
  selector: 'home-offers',
  templateUrl: './home-offers.component.html',
  styleUrls: ['./home-offers.component.scss']
})
export class HomeOffersComponent implements OnInit {
  handler: any = null;
  offerChoiceAmount: number = null;
  subscriptionPage = false;


  constructor(private router: Router) { }

    ngOnInit() {
      // recuperation l'offre selectionné
      // this.offerChoiceAmount = this.session.offerChoiceAmount ? this.session.offerChoiceAmount : null;
      this.offerChoiceAmount = +localStorage.getItem('offerChoiceAmount') || null;


      // savoir si on est sur la page home ou sur la page abonnement interne (log)
      this.subscriptionPage = this.router.url.startsWith('/subscription');

      // recuperation offres back
      /*this.apiClientService.get(API_URI_OFFER).subscribe( offers => {

        offers = offers.filter(offer=>offer.title!=="Gratuit" && offer.title !== "Expirée");
        offers.forEach(offer => {
          offer.description = offer.description.split('$');
          this.listOffers.push(offer);
        });
      },
      );*/
    }

    goBack(){
        this.router.navigate(['/dashboard/campaigns']);
    }

    goToPay() {
      // changement d'offre
      //localStorage.setItem('offerChoiceAmount' , offer.price);
      // this.session.offerChoiceAmount = offer.price;
      //this.offerChoiceAmount = offer.price;

      // if (offer.price === 0 && this.subscriptionPage) {
      //   // version gratuite
      //   this.router.navigate(['/dashboard/campaigns']);
      // } else {
      if (this.router.url.startsWith('/subscription')) {
          // traitement user back
          // this.session.offerChoice = offer;
          //localStorage.setItem('offerChoice', JSON.stringify(offer));
          this.router.navigate(['/stripePayment']);
        } else {
          this.router.navigate(['/home/register']);
        }
      }
    // }

}
