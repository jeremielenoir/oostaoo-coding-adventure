import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EMPTY, forkJoin, Observable, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { switchMap, tap } from 'rxjs/operators';
import { API_URI_CAMPAIGNS, API_URI_CANDIDATS, API_URI_CANDIDATS_BY_TOKEN, ApiClientService, API_URI_TUTORIAL } from "../../../api-client/api-client.service";

@Component({
  selector: "app-client-test",
  styleUrls: ["./client-test.component.scss"],
  templateUrl: "./client-test.component.html",
})

export class ClientTestComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private tokenId: string;
  public popupTestStatus: boolean = false;
  public testStatus$: BehaviorSubject<string> = new BehaviorSubject("eval"); // "eval", "tutorial", "testing"
  public nbQuestion: number;
  public durationTotalTest: number;
  public campaignId: number = 0;
  public campaignTitle: string = '';
  public candidat: Record<string, any>;
  public questions: Record<string, any>[];
  public trainingQuestions: Record<string, any>[];
  public technologies: Record<string, any>[];
  public durationMaxTest: number;
  public isAgreed: boolean = false;

  constructor(private route: ActivatedRoute, private apiClientService: ApiClientService, private router: Router) {
    this.route.queryParams.subscribe((params) => this.tokenId = params.id);
  }

  ngOnInit(): void {
    this.loading$.next(true);
    this.subscription = forkJoin([
      this.getCandidatCampaign(),
      this.getTutorialCampaign()
    ]).subscribe(([campaignCandidat, campaignTutorial]) => {
      this.nbQuestion = campaignCandidat.questions.length;
      this.campaignId = campaignCandidat.id;
      this.campaignTitle = campaignCandidat.Name;

      const secondTime: number = campaignCandidat.questions.reduce((acc, curr) =>  acc + curr.time, 0);
      this.durationTotalTest = Math.floor(secondTime / 60);
      this.durationMaxTest = this.durationTotalTest + 10;

      this.questions = campaignCandidat.questions;
      this.technologies = campaignCandidat.technologies;

      this.trainingQuestions = campaignTutorial.questions;

      this.loading$.next(false);
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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


  private getTutorialCampaign(): Observable<Record<string, any>> {
    return this.apiClientService.get(API_URI_TUTORIAL);
  }


  private getCandidatCampaign(): Observable<Record<string, any>> {
    return this.apiClientService.get(API_URI_CANDIDATS_BY_TOKEN + "/" + this.tokenId).pipe(
      tap((candidat: Record<string, any>) => {
        this.candidat = candidat;
        if (candidat.test_terminer !== "0000-00-00 00:00:00") {
          this.router.navigate(["/home"]);
          return EMPTY;
        };

        const currentDatetime = new Date().toISOString();
        this.candidatOpenedLinkAt(candidat.id, currentDatetime);
      }),
      switchMap(candidat => this.apiClientService.get(API_URI_CAMPAIGNS + "/" + candidat.campaign.id)),
    );

  }

  private candidatOpenedLinkAt(candidatId: number, currentDatetime: string): void {
    this.apiClientService.put(API_URI_CANDIDATS + "/" + candidatId, { opened_link: currentDatetime }).subscribe().unsubscribe();
  }

  public refreshComponent(status: string) {
    this.testStatus$.next(status);
  }
}