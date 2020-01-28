import { Injectable } from '@angular/core';
import { Offer } from 'src/app/models/offer.model';
import { Subject } from 'rxjs';


// a utiliser a la place de localstorage pour le passage d'info entre component
// avec (mobx-persist ???) pour garder les infos apres recharge de la page
// https://github.com/mobxjs/mobx/issues/1544

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  offerChoiceAmount: number;
  offerChoice: Offer;

  // offerSubject = new Subject<Offer>();

  constructor() { }
}
