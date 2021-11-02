import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { API_URI_CAMPAIGNS, API_URI_CANDIDATS, ApiClientService } from "../../../api-client/api-client.service";

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
  public candidat: Record<string, any>;
  public questions: Record<string, any>[];
  public technologies: Record<string, any>[];
  public durationMaxTest: number;
  public isAgreed: boolean = false;

  @ViewChild("btnchecked") public btnchecked: ElementRef;

  constructor(private route: ActivatedRoute, private apiClientService: ApiClientService, private router: Router) {
    this.route.queryParams.subscribe((params) => this.tokenId = params.id);
  }

  ngOnInit() {
    this.getCandidats();
  }

  public hundelechecked(event) {
    console.log(event);
    if (event.target.checked === true) {
      // this.btnchecked.nativeElement.disabled == true
      this.btnchecked.nativeElement.disabled = false;
    } else {
      this.btnchecked.nativeElement.disabled = true;
    }
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
    this.testStatus$.next("tutorial");
  }

  public getCandidats() {
    this.apiClientService.get(`${API_URI_CANDIDATS}?token=${this.tokenId}`)
      .toPromise()
      .then((candidats: Record<string, any>[]) => {
        const datetimeTestOpened: string = new Date().toISOString();
        
        for (const candidat of candidats) {
          if (candidat.test_terminer !== "0000-00-00 00:00:00") {
            this.testStatus$.next("");

            return this.router.navigate(["/home"]);
          }

          this.postOpenTimeTest(datetimeTestOpened, candidat.id);
          
          this.apiClientService.get(API_URI_CAMPAIGNS + "/" + candidat.campaign.id)
            .toPromise()
            .then((campaign: Record<string, any>) => {
              console.log(campaign);

              this.nbQuestion = campaign.questions.length;
              
              const secondTime: number = campaign.questions.reduce((acc, curr) =>  acc + curr.time, 0);
              
              this.durationTotalTest = Math.floor(secondTime / 60);
              this.durationMaxTest = this.durationTotalTest + 10;

              this.questions = campaign.questions;
              this.technologies = campaign.technologies;
            });
          
          this.candidat = candidat;
        }
    });
  }

  private postOpenTimeTest(dateOpen, candidatId: number): Promise<any> {
    return this.apiClientService.put(API_URI_CANDIDATS + "/" + candidatId, {
      test_ouvert: dateOpen,
    }).toPromise();
  }

  public refreshComponent(event) {
    this.testStatus$.next(event);
  }
}