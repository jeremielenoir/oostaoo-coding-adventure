import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_OFFER, API_URI_USER, API_URI_PAYMENT } from 'src/app/api-client/api-client.service';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  payload: {amount: number, token: any} ;

  elements: Elements;
  card: StripeElement;
  
 
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'fr'
  };

  stripeTest: FormGroup;

  constructor(private router: Router,
              private apiClientService: ApiClientService,
              private fb: FormBuilder,
              private stripeService: StripeService
    ) { }

    ngOnInit() {
      this.apiClientService.get(API_URI_OFFER).subscribe( offers => {
        this.listOffers = offers; console.log(offers);
      });

      // recuperation de l'abonnement selectionné
      this.subscriptionChoice = localStorage.getItem('subscriptionChoice');
      // savoir si on est sur la page home ou sur la page abonnement interne (log)
      this.subscriptionPage = this.router.url.startsWith('/subscription');




      this.stripeTest = this.fb.group({
        name: ['', [Validators.required]]
      });
      this.stripeService.elements(this.elementsOptions)
        .subscribe(elements => {
          this.elements = elements;
          // Only mount the element the first time
          if (!this.card) {
            this.card = this.elements.create('card', {
              style: {
                base: {
                  iconColor: '#666EE8',
                  color: '#31325F',
                  lineHeight: '40px',
                  fontWeight: 300,
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '18px',
                  '::placeholder': {
                    color: '#CFD7E0'
                  }
                }
              }
            });
            this.card.mount('#card-element');
          }
        });
    }


    buy() {
      const name = this.stripeTest.get('name').value;
      this.stripeService
        .createToken(this.card, { name })
        .subscribe(result => {
          if (result.token) {
            // Use the token to create a charge or a customer
            // https://stripe.com/docs/charges

            this.payload = {
              amount: 249 * 100,
              token: result.token
            }
            console.log(this.payload);
            this.apiClientService.post(API_URI_PAYMENT + '/subscribe', this.payload)
            .subscribe(data => console.log('data from constroll back', data));
            // console.log(result.token);
          } else if (result.error) {
            // Error creating the token
            console.log(result.error.message);
          }
        });
    }


  gotToLoginOrDashboardPage(subscriptionAmount) {
    // sauvegarde de l'abonnement selectionné
    localStorage.setItem('subscriptionChoice', subscriptionAmount);
    this.subscriptionChoice = localStorage.getItem('subscriptionChoice');


    if (this.router.url.startsWith('/subscription')) {
      console.log('Nous sommes sur abonnement interne');
      //this.pay(subscriptionAmount);
      // this.router.navigate(['/dashboard/campaigns']);
    } else {
      console.log('Nous sommes sur abonnement home');
      this.router.navigate(['/home/register']);
    }
  }





}
