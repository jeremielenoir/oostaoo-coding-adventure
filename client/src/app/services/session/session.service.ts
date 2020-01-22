import { Injectable } from '@angular/core';
import { Offer } from 'src/app/models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  offerChoiceAmount: number;
  offerChoice: Offer;

  constructor() { }
}
