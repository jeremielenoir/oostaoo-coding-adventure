import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  handler: any = null;
  subscriptionChoice = null;
  subscriptionPage = false;
  ListOffers = [];

  constructor(private router: Router, private apiClientService: ApiClientService) { }

  ngOnInit() {
    this.loadStripe();

    

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
      //this.router.navigate(['/dashboard/campaigns']);
    } else {
      console.log('Nous sommes sur abonnement home');
      this.router.navigate(['/home/register']);
    }
  }



  // load <script src="https://checkout.stripe.com/checkout.js"></script> in appComponent
  loadStripe() {
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      // s.onload = () => {
      //   this.handler = (<any>window).StripeCheckout.configure({
      //     key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
      //     locale: 'auto',
      //     token: function (token: any) {
      //       // You can access the token ID with `token.id`.
      //       // Get the token ID to your server-side code for use.
      //       console.log(token)
      //       alert('Payment Success!!');
      //     }
      //   });
      // }
      window.document.body.appendChild(s);
    }
  }

  pay(amount) {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_jwK67X7FA3xfM8g4GxegZEVe00xbYkFsPq',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token);
        //this.router.navigate(['/dashboard/campaigns']);
        alert('Token Created!!');
      }
    });

    handler.open({
      name: 'Roodeo',
      description: 'payement',
      amount: amount * 100,
     // devise: 'EUR'
    });
  }



}
