import { Component, OnInit } from '@angular/core';
import { API_URI_FAQ, ApiClientService } from 'src/app/api-client/api-client.service';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit {
  panelOpenState = false;
  faqs: any;

  constructor(public apiClientService: ApiClientService) {
  }

  ngOnInit() {
    this.apiClientService.get(API_URI_FAQ).toPromise().then(faqs =>{
      console.log('faqs : ', faqs);
      this.faqs = faqs;
    });
  }
}
