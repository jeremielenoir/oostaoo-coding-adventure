import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethod } from 'ngx-stripe/lib/interfaces/payment-intent';

@Component({
  selector: 'app-creditcard',
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.css']
})
export class CreditcardComponent implements OnInit {

  @Input() pm: PaymentMethod;

  constructor() { }

  ngOnInit() {
  }

}
