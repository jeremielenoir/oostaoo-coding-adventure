import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { API_URI_CAMPAIGNS, ApiClientService, API_URI_CANDIDATS } from '../../../api-client/api-client.service';

@Component({
  selector: 'app-client-test',
  templateUrl: './client-test.component.html',
  styleUrls: ['./client-test.component.scss']
})

export class ClientTestComponent implements OnInit {
  public idParam: string;
  public checkedBoolean: boolean;
  public ActiveTest: boolean;
  public StatueTestingQuestion = 'eval';
  public candidat: string;
  public dateOpenTest: any;
  public nbQuestion: number;
  public durationTotalTest: number;
  public durationMaxTest: number;


  @ViewChild('btnchecked') btnchecked: ElementRef;
  idCampaign: any;
  questionCampaign = [];
  technoCampaign = [];

  constructor(private route: ActivatedRoute, private apiClientService: ApiClientService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.idParam = params.id;
    });
  }

  ngOnInit() {
    this.dateOpenTest = new Date().toISOString();
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
    this.apiClientService.get(`${API_URI_CANDIDATS}?token=${this.idParam}`).toPromise().then(res => {
      for (const candidat of res) {
          this.candidat = candidat;
          console.log('candidat this.candidat', this.candidat);
          if (candidat.invitation_date !== candidat.test_terminer) {
            this.StatueTestingQuestion = 'fin';
          }
          this.idCampaign = candidat.campaign.id;
          // console.log('test', this.idCampaign)
          this.postOpenTimeTest(this.dateOpenTest, candidat.id);
          // console.log('this.idCampaign : ', this.idCampaign);
          this.apiClientService.get(API_URI_CAMPAIGNS + '/' + this.idCampaign).toPromise().then(res1 => {
            this.nbQuestion = res1.questions.length;
            let secondTime = 0;
            for (const question of res1.questions) {
              secondTime = secondTime + question.time;
            }
            this.durationTotalTest = Math.floor(secondTime / 60);
            this.durationMaxTest = this.durationTotalTest + 10;
            this.questionCampaign = [...res1.questions];
            this.technoCampaign = [...res1.technologies];
            // console.log('this.questionCampaign: ', this.questionCampaign);
            // console.log('this.technoCampaign: ', this.technoCampaign);
          });
          return this.router.navigate(['/evaluate'], {
            queryParams: {
              id: this.idParam
            }
          });
      }
      return this.router.navigate(['/home']);
    });
  }

  postOpenTimeTest(dateOpen, candidat): Promise<any> {
    return this.apiClientService.put(API_URI_CANDIDATS + '/' + candidat, {
      test_ouvert: dateOpen
    }).toPromise().then(res => {
      console.log('candidat', res);
    });
  }
  refreshComponent(event) {
    this.StatueTestingQuestion = event;
  }
}
