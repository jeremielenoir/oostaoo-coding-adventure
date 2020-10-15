import { Component, OnInit } from '@angular/core';
import { API_URI_FAQ, ApiClientService } from 'src/app/api-client/api-client.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit {
  panelOpenState = false;
  faqs: any;
  listTest : Array<String>;
  filterParams: any;
  dataRoute: any;
  constructor(public apiClientService: ApiClientService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      // if (params['edit']) {
      // }
      console.log('params in FAQ : ', params);
      this.filterParams = params.dynamicParams
    });
  }

  ngOnInit() {
    // declaration nav route
    this.dataRoute = [
      { routerLink : "/dashboard/faq", condition: true, classAnimParent: "hvr-icon-bounce", classAnimIcone: "hvr-icon", icon: "contact_support", name: "FAQ" },
      { routerLink : "/dashboard/contact-support", condition: true, classAnimParent: "hvr-icon-bounce", classAnimIcone: "hvr-icon", icon: "place", name: "Contact" }
    ];
    this.apiClientService.get(API_URI_FAQ).toPromise().then(faqs => {
      // console.log('faqs : ', faqs);
      this.faqs = faqs;
      this.faqs[0].open = true;
      return this.listTest = Array.from(new Set(faqs.map(faq => faq.type)));
    }).then(listType =>{
      if(!listType.includes(this.filterParams)){
        this.filterParams = ''
      }
    });
  }
}
