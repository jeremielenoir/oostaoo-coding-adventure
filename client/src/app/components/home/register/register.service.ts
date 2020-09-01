import { Injectable } from '@angular/core';

@Injectable()
export class DecryptTokenService {

  ca;
  base64Url;
  decodedValue;
  userId;
  adminId;
  offer_id;
  tests_available;

  constructor() {
    this.ca = localStorage.getItem('currentUser');
    if (this.ca) {
      this.base64Url = this.ca.split('.')[1];
      this.decodedValue = JSON.parse(window.atob(this.base64Url));
      this.userId = this.decodedValue.id;
      this.adminId = this.decodedValue.adminId;
      this.offer_id = this.decodedValue.offer_id;
      this.tests_available = this.decodedValue.tests_available;
      this.tests_available = 0; // WIP SL
      console.log("1. tests_available =", this.tests_available); // WIP SL
    }
  }


  get userIdExporte(): any {
    return { userId: this.userId, userAdmin: this.adminId };
  }
}
