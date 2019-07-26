import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { API_URI_CAMPAIGNS, ApiClientService, API_URI_CANDIDATS } from '../../../api-client/api-client.service';

@Component({
  selector: 'app-client-test',
  templateUrl: './client-test.component.html',
  styleUrls: ['./client-test.component.css']
})
export class ClientTestComponent implements OnInit {
  public idParam: string;
  public checkedBoolean: boolean;
  public ActiveTest: boolean;
  public StatueTestingQuestion = 'eval';

  @ViewChild('btnchecked') btnchecked: ElementRef;
  idCampaign: any;
  questionCampaign = [];

  constructor(private route: ActivatedRoute, private apiClientService: ApiClientService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.idParam = params.id;
    });
  }

  ngOnInit() {
    console.log('this.idParam : ', this.idParam);
    this.getCandidats();
  }

  public hundelechecked(event) {

    if (event.target.checked === true) {

      // this.btnchecked.nativeElement.disabled == true

      this.btnchecked.nativeElement.disabled = false;

    } else {
      this.btnchecked.nativeElement.disabled = true;
    }

  }

  hundleActiveTest() {

    this.ActiveTest = true;

    // console.log('state', this.ActiveTest);
  }

  NohundleActiveTest() {
    this.ActiveTest = false;
  }

  HundleStatueTestingQuestion() {

    this.StatueTestingQuestion = 'testing';

  }
  getCandidats() {
    this.apiClientService.get(API_URI_CANDIDATS).toPromise().then(res => {
      for (const candidat of res) {
        const hasValue = Object.values(candidat).includes(this.idParam);
        console.log(hasValue, 'hasValue');
        if (this.idParam === candidat.token) {
          console.log(candidat);
          this.idCampaign = candidat.campaign.id;
          console.log('this.idCampaign : ', this.idCampaign);
          this.router.navigate(['/evaluate'], {
            queryParams: {
              id: this.idParam
            }
          });
        } else {
          this.router.navigate(['/home']);
        }
      }
      return this.idCampaign;
    }).then(idCampaign => {
      this.apiClientService.get(API_URI_CAMPAIGNS + '/' + idCampaign).toPromise().then(res => {
        console.log('res campaing: ', res);
        this.questionCampaign = [...this.questionCampaign, ...res.questions];
        console.log('this.questionCampaign: ', this.questionCampaign);
      });
    });
  }
}
