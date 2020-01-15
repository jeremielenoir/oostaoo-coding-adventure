import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_OFFER } from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  handler: any = null;
  subscriptionChoice = null;
  subscriptionPage = false;
  listOffers = [];

  constructor(private router: Router, private apiClientService: ApiClientService) { }

  public Stripe = window['Stripe'];

  public stripe = this.Stripe('pk_test_jwK67X7FA3xfM8g4GxegZEVe00xbYkFsPq');

  pay = (subscriptionAmount) => {
    this.stripe.redirectToCheckout({
      items: [{
        // Define the product and SKU in the Dashboard first, and use the SKU
        // ID in your client-side code.
        plan: 'plan_123',
        quantity: 1
      }],
      successUrl: 'https://www.example.com/success',
      cancelUrl: 'https://www.example.com/cancel'
    });
  }

  ngOnInit() {
    this.apiClientService.get(API_URI_OFFER).subscribe( offers => {this.listOffers = offers; console.log(offers)});
    
    // recuperation de l'abonnement selectionné
    this.subscriptionChoice = localStorage.getItem('subscriptionChoice');
    // savoir si on est sur la page home ou sur la page abonnement interne (log)
    this.subscriptionPage = this.router.url.startsWith('/subscription');
  }

  gotToLoginOrDashboardPage(subscriptionAmount) {
    // sauvegarde de l'abonnement selectionné
    localStorage.setItem('subscriptionChoice', subscriptionAmount);
    this.subscriptionChoice = localStorage.getItem('subscriptionChoice');


    if (this.router.url.startsWith('/subscription')) {
      console.log('Nous sommes sur abonnement interne');
      this.pay(subscriptionAmount);
      // this.router.navigate(['/dashboard/campaigns']);
    } else {
      console.log('Nous sommes sur abonnement home');
      this.router.navigate(['/home/register']);
    }
  }





}
