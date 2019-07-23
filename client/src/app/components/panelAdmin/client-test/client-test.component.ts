import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS
} from '../../../api-client/api-client.service';

@Component({
  selector: 'app-client-test',
  templateUrl: './client-test.component.html',
  styleUrls: ['./client-test.component.css']
})
export class ClientTestComponent implements OnInit {
  idParam: string;

  constructor(private route: ActivatedRoute, private apiClientService: ApiClientService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.idParam = params.id;
    });
  }

  ngOnInit() {
    console.log('this.idParam : ', this.idParam);
    this.getCandidats();
  }

  getCandidats() {
    this.apiClientService.get(API_URI_CANDIDATS).toPromise().then(res => {
      for (const candidat of res) {
        if (candidat.token === this.idParam) {
          this.router.navigate(['/evaluate?id=' + this.idParam]);
        }
        if (candidat.token !== this.idParam) {
          this.router.navigate(['/home']);
        }
      }
    });
  }
}
