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
  stripeSuccess: string=null;
  stripeLoader = false;

  payload: any;
  paymentCreationBody: any;
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
    window.scroll(0,0);
    // recuperation de l'offre
    //this.offerChoice = this.session.offerChoice;
    this.offerChoice = JSON.parse(localStorage.getItem('offerChoice'));
    console.log('offerChoice : ', this.offerChoice);

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
    console.log('this user info : ', this.userInfo);
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
          console.log('this payload : ', this.payload);
            this.apiClientService.post(API_URI_PAYMENT + '/pay', this.payload)
              .subscribe(res => {

                if(!res.status){
                  console.log('erreur : ', res.raw.message);
                  this.stripeError = "Votre paiement a échoué";
                  if(this.card){
                    this.card.unmount();
                    this.card.mount('#card-element');
                  }
                  setTimeout(()=>{this.stripeError = ''}, 2000);
                  this.stripeLoader = false;

                }else if(res.status=='succeeded' || 'active'){
                  console.log('res : : ', res);
                  this.paymentCreationBody = {
                    amount: this.offerChoice.price,
                    offer_id: this.offerChoice.id,
                    tests_available: this.offerChoice.tests_stock,
                    user_id: this.userInfo.id,
                    date_payment: Date.now(),
                    paymentId: res.id
                  }
                  console.log('this paymentCreationBody : ', this.paymentCreationBody);
                    this.apiClientService.post(API_URI_PAYMENT, this.paymentCreationBody)
                    .subscribe(res=>{
                      console.log('payment create res : ', res);
                      if(res.refund){
                         console.log('refund: ', res.refund);
                         if(this.card){
                          this.card.unmount();
                         }
                        setTimeout(()=>{
                          this.stripeError = '';
                          this.card.mount('#card-element');
                        }, 2000);

                         this.stripeError = "Un problème technique est survenu";
                         this.stripeLoader = false;
                        return;
                      }else{
                        this.stripeSuccess = 'Votre paiement a été effectué';
                        this.stripeLoader = false;
                        setTimeout(()=>{
                          this.router.navigate(['/dashboard/campaigns']);
                        }, 1200);
                      }
                    })
                }
              });

            // });
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
