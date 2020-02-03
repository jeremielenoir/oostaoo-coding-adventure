import { Component, OnInit } from '@angular/core';
import { ApiClientService, API_URI_OFFER, API_URI_USER, API_URI_PAYMENT } from 'src/app/api-client/api-client.service';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Offer } from 'src/app/models/offer.model';
import { SessionService } from 'src/app/services/session/session.service';
import { DecryptTokenService } from '../register/register.service';


@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {
  offerChoice: any;
  userInfo: any;

  stripeError: string = null;
  stripeLoader = false;

  payload: any;

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
    private stripeService: StripeService,
    private session: SessionService,
    private userToken: DecryptTokenService
  ) { }

  ngOnInit() {
    // recuperation de l'offre
    //this.offerChoice = this.session.offerChoice;
    this.offerChoice = JSON.parse(localStorage.getItem('offerChoice'));
    console.log(this.offerChoice);

    // info utilisateur a recuperer de la bdd
    this.apiClientService.get(API_URI_USER + '/' + this.userToken.userId).subscribe(user => this.userInfo = user);

    this.stripeForm();
  }

  stripeForm() {

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
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }


  buy() {
    //const name = this.stripeTest.get('name').value;
    this.stripeLoader = true;
    // username utilisateur
    console.log('totoro', this.userInfo);
    const name = this.userInfo.username;

    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges


          this.payload = {
            offer: this.offerChoice,
            email: this.userInfo.email,
            token: result.token
          };

          console.log('isma', this.payload);

          this.apiClientService.post(API_URI_PAYMENT + '/subscribe', this.payload)
            .subscribe(data => {
              console.log('data from constroll back', data);
              this.stripeLoader = false;
              this.router.navigate(['/dashboard/campaigns']);
            }, error => {
              // switch case d'apres la reponse de stripe
              this.stripeError = error;
              this.stripeLoader = false;
            });
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
          this.stripeLoader = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/subscription']);
  }

}
