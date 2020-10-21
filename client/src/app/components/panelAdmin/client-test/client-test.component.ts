import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { API_URI_CAMPAIGNS, API_URI_CANDIDATS, ApiClientService } from "../../../api-client/api-client.service";

@Component({
  selector: "app-client-test",
  styleUrls: ["./client-test.component.scss"],
  templateUrl: "./client-test.component.html",
})

export class ClientTestComponent implements OnInit {
  public idParam: string;
  public checkedBoolean: boolean;
  public ActiveTest: boolean;
  public StatueTestingQuestion = "eval";
  public candidat: string;
  public dateOpenTest: any;
  public nbQuestion: number;
  public durationTotalTest: number;
  public durationMaxTest: number;

  @ViewChild("btnchecked") public btnchecked: ElementRef;
  public idCampaign: any;
  public questionCampaign = [];
  public technoCampaign = [];

  constructor(private route: ActivatedRoute, private apiClientService: ApiClientService, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.idParam = params.id;
    });
  }

  public ngOnInit() {
    this.dateOpenTest = new Date().toISOString();
    console.log("this.idParam : ", this.idParam);
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

  public hundleActiveTest() {
    this.ActiveTest = true;
    //console.log("state", this.ActiveTest);
  }

  public noHandleActiveTest() {
    this.ActiveTest = false;
  }

  public handleStatusTestingQuestion() {
    this.StatueTestingQuestion = "testing";
  }

  public getCandidats() {
    this.apiClientService.get(`${API_URI_CANDIDATS}?token=${this.idParam}`).toPromise().then((res) => {
      for (const candidat of res) {
        this.candidat = candidat;
        console.log("candidat this.candidat", this.candidat);
        if (candidat.test_terminer !== "0000-00-00 00:00:00") {
          this.StatueTestingQuestion = "fin";
          return this.router.navigate(["/home"]);
        }
        this.idCampaign = candidat.campaign.id;
        this.postOpenTimeTest(this.dateOpenTest, candidat.id);
        this.apiClientService.get(API_URI_CAMPAIGNS + "/" + this.idCampaign).toPromise().then((res1) => {
          this.nbQuestion = res1.questions.length;
          let secondTime = 0;
          for (const question of res1.questions) {
            secondTime = secondTime + question.time;
          }
          this.durationTotalTest = Math.floor(secondTime / 60);
          this.durationMaxTest = this.durationTotalTest + 10;
          this.questionCampaign = [...res1.questions];
          this.technoCampaign = [...res1.technologies];
          // console.log("this.questionCampaign: ", this.questionCampaign);
          // console.log("this.technoCampaign: ", this.technoCampaign);
        });
        /*return this.router.navigate(["/evaluate"], {
          queryParams: {
            id: this.idParam
          }
        });*/
      }
      //
    });
  }

  public postOpenTimeTest(dateOpen, candidat): Promise<any> {
    return this.apiClientService.put(API_URI_CANDIDATS + "/" + candidat, {
      test_ouvert: dateOpen,
    }).toPromise().then((res) => {
      console.log("candidat", res);
    });
  }
  public refreshComponent(event) {
    this.StatueTestingQuestion = event;
  }
}
