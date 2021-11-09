import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { API_URI_CAMPAIGNS, API_URI_CANDIDATS, API_URI_CANDIDATS_BY_TOKEN, ApiClientService } from "../../../api-client/api-client.service";

@Component({
  selector: "app-client-test",
  styleUrls: ["./client-test.component.scss"],
  templateUrl: "./client-test.component.html",
})

export class ClientTestComponent implements OnInit {
  private tokenId: string;
  public popupTestStatus: boolean = false;
  public testStatus$: BehaviorSubject<string> = new BehaviorSubject("eval"); // "eval", "tutorial", "testing"
  public nbQuestion: number;
  public durationTotalTest: number;
  public campaignId: number = 0;
  public candidat: Record<string, any>;
  public questions: Record<string, any>[];
  public trainingQuestions: Record<string, any>[];
  public technologies: Record<string, any>[];
  public durationMaxTest: number;
  public isAgreed: boolean = false;

  constructor(private route: ActivatedRoute, private apiClientService: ApiClientService, private router: Router) {
    this.route.queryParams.subscribe((params) => this.tokenId = params.id);
  }

  ngOnInit() {
    this.getCandidats();
  }


  public openPopup() {
    this.popupTestStatus = true;
  }

  public closePopup() {
    this.popupTestStatus = false;

  }

  public runTest() {
    this.testStatus$.next("testing");
  }

  public runTutorial() {
    this.trainingQuestions = this.questions.slice(0, 4);
    this.testStatus$.next("tutorial");
  }

  private getCandidats() : any{
    return this.apiClientService.get(API_URI_CANDIDATS_BY_TOKEN + "/" + this.tokenId)
      .toPromise()
      .then((candidat: Record<string, any>) => {
        const datetimeTestOpened: string = new Date().toISOString();
        this.candidat = candidat;

        if (candidat.test_terminer !== "0000-00-00 00:00:00") {
          this.testStatus$.next("");

          return this.router.navigate(["/home"]);
        }

        this.postOpenTimeTest(datetimeTestOpened, candidat.id).then();
        
        this.apiClientService.get(API_URI_CAMPAIGNS + "/" + candidat.campaign.id)
          .toPromise()
          .then((campaign: Record<string, any>) => {
            this.nbQuestion = campaign.questions.length;
            this.campaignId = campaign.id;

            
            const secondTime: number = campaign.questions.reduce((acc, curr) =>  acc + curr.time, 0);
            
            this.durationTotalTest = Math.floor(secondTime / 60);
            this.durationMaxTest = this.durationTotalTest + 10;

            this.questions = campaign.questions;
            this.technologies = campaign.technologies;
            return campaign;
          });

          
    });
  }

  private postOpenTimeTest(dateOpen: string, candidatId: number): Promise<any> {
    return this.apiClientService.put(API_URI_CANDIDATS + "/" + candidatId, { test_ouvert: dateOpen }).toPromise();
  }

  public refreshComponent(status: string) {
    this.testStatus$.next(status);
  }
}