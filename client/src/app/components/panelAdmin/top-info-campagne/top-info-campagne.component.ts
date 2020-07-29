import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  EventEmitter, 
  Output
} from "@angular/core";

import {
  ApiClientService,
  API_URI_QUESTIONS,
  API_URI_CAMPAIGNS,
} from "../../../api-client/api-client.service";

import Chart from "chart.js";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DecryptTokenService } from "src/app/components/home/register/register.service";
import { TooltipPosition, MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { SwiperComponent, SwiperConfigInterface} from "ngx-swiper-wrapper";


@Component({
  selector: "app-top-info-campagne",
  templateUrl: "./top-info-campagne.component.html",
  styleUrls: ["./top-info-campagne.component.scss"],
})
export class TopInfoCampagneComponent implements OnInit, OnChanges {

  @Input() formCampagne: FormGroup;
  @Input() questions;
  @Input() yourCampaign;
  @Input() technologies;
  @Output() decrementPage = new EventEmitter<any>();
  @ViewChild("Chart") Chart: ElementRef;

  public globalId: number;
  public updateQuestionsCampaign: number[] = [];
  public technoDonuts: any[] = [];
  public elementDonnut: any;
  public poinTotal: number = 0;
  public timeAllquestionCampagn = 0;
  public timeAllquestionCampgnDevice = 0;
  public campagneFull = [];
  public technoLabel = [];
  public technoPoint = [];

  public config: SwiperConfigInterface = {
      a11y: true,
      direction: 'horizontal',
      slidesPerView: 3,
      slideToClickedSlide: true,
      mousewheel: true,
      scrollbar: false,
      watchSlidesProgress: true,
      navigation: false,
      keyboard: true,
      pagination: false,
      centeredSlides: false,
      loop: false,
      roundLengths: true,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      spaceBetween: 0,
      width: 550
      /*breakpoints: {
          // when window width is >= 320px
          320: {
              slidesPerView: 1
          }
      }*/
  };

  @ViewChild(SwiperComponent) componentRef: SwiperComponent;
  

  constructor(
    public apiClientService: ApiClientService,
    private router: Router,
    public decryptTokenService: DecryptTokenService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.route.parent.params.subscribe((params) => {
      this.globalId = params.id;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes", changes);
    this.technoMethod();
    console.log('TECHNO DONUTS', this.technoDonuts);
  }

  convertSecondsToMinutes( time) {
    return Math.floor(time / 60);
  }

  public onChangeIndex($event){
    console.log('test');
  }

  public nextSlide(){
    this.componentRef.directiveRef.nextSlide();
    
    console.log(this.componentRef.isAtLast);
  }

  public prevSlide(){
    this.componentRef.directiveRef.prevSlide();
    console.log(this.componentRef.isAtFirst);
  }

  public technoMethod(): void{

    let summaries: IHash = {};
    let totalPoint = 0;
    let totalTime = 0;

    for (let technologie of this.technologies) {
      summaries[technologie.id] = {
        label: technologie.name,
        value: 0,
        question: 0,
        timeQuestion: 0,
        timeQuestionDIvice: 0
      }
    }

    if (this.questions && this.questions.length > 0) {
      for (let question of this.questions) {
            totalPoint += question["points"];
            totalTime += Number(question.time);
            summaries[question["technologies"].id].value += question["points"];
            summaries[question["technologies"].id].question ++;
            summaries[question["technologies"].id].timeQuestion += Number(question.time);
      }
    }

    this.technoDonuts = [...Object.values(summaries)];
    this.poinTotal = totalPoint;
    this.timeAllquestionCampagn = totalTime;
    this.timeAllquestionCampgnDevice = totalTime / 2;
    
    //donut chart
    this.technoLabel = [];
    this.technoPoint = [];
    Object.values(summaries).forEach((value) => {
      this.technoLabel.push(value.label);
      this.technoPoint.push(value.value);
    });
    
    this.elementDonnut = this.Chart.nativeElement.getContext("2d");

    let chart = new Chart(this.elementDonnut, {
      type: "doughnut",

      data: {
        labels: this.technoLabel,
        datasets: [
          {
            label: "diagram",
            backgroundColor: ["#1d3552", "#e34e26", "#1f7eab", "#c1d5df"],
            borderColor: ["#1d3552", "#e34e26", "#1f7eab", "#c1d5df"],
            data: this.technoPoint,
          },
        ],
      },

      // Configuration options go here
      options: {
        legend: {
          display: false,
        },

        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              // return data['datasets'][0]['data'][tooltipItem['index']]+' pts';
            },
            // afterLabel: function(tooltipItem, data) {
            //   return ' pts'
            // }
          },

          backgroundColor: "#fff",
          titleFontSize: 13,
          titleFontColor: "#1d3552",
          bodyFontColor: "#1d3552",
          bodyFontSize: 13,
          displayColors: false,
          footerMarginTop: "10",
          titleAlign: "center",
        },
      },
    });

  }

  /*technoMethod2() {

    let nbPoints = 0;
    let points = [];
    let timeArraySolo = [];
    let arraytimeAllquestionCampagn = [];
    let timeQuestionCampagne = 0;
    let deparPointNumberQuestion = 0;
    let nbTime = 0;
    let technoDonuts = [];
    let poinTotal = 0;
    let timeAllquestionCampagn = 0;
    let timeAllquestionCampgnDevice = 0;
    let technoLabel = [];
    let technoPoint = [];

    if (this.questions && this.questions.length > 0) {
      for (let question of this.questions) {
        arraytimeAllquestionCampagn.push(Number(question.time));
      }
    }


    for (let technologie of this.technologies) {
      if (this.questions && this.questions.length) {
        for (let question of this.questions) {
          if (technologie["id"] == question["technologies"].id) {
            nbPoints = nbPoints + question["points"];
            nbTime = nbTime + question["time"];
            deparPointNumberQuestion++;
          }
        }
      }

      points.push(nbPoints);

      timeArraySolo.push(nbTime);

      points = points.filter((element) => element !== 0);
      if (points && points.length > 0) {
        poinTotal = points.reduce(
          (accumulator, currenValue) => accumulator + currenValue
        );
      }

      timeQuestionCampagne = 0;

      technoDonuts.push({
        label: technologie["name"],
        value: nbPoints,
        question: deparPointNumberQuestion,
        timeQuestion: nbTime,
        timeQuestionDIvice: nbTime / 2,
      });
      technoDonuts = technoDonuts.filter((element) => element.value != 0);

      nbPoints = 0;
      deparPointNumberQuestion = 0;
      nbTime = 0;
    }

    if (arraytimeAllquestionCampagn && arraytimeAllquestionCampagn.length > 0) {
      timeAllquestionCampagn = arraytimeAllquestionCampagn.reduce(
        (accumulator, currenValue) => accumulator + currenValue
      );
      timeAllquestionCampgnDevice = timeAllquestionCampagn / 2;
    }

    for (let tech of technoDonuts) {
      technoLabel.push(tech.label);
      technoPoint.push(tech.value);
    }
    this.technoDonuts = technoDonuts;
    this.poinTotal = poinTotal;
    this.timeAllquestionCampagn = timeAllquestionCampagn;
    this.timeAllquestionCampgnDevice = timeAllquestionCampgnDevice;
    this.technoLabel = technoLabel;
    this.technoPoint = technoPoint;

    this.elementDonnut = this.Chart.nativeElement.getContext("2d");

    let chart = new Chart(this.elementDonnut, {
      type: "doughnut",

      data: {
        labels: this.technoLabel,
        datasets: [
          {
            label: "diagram",
            backgroundColor: ["#1d3552", "#e34e26", "#1f7eab", "#c1d5df"],
            borderColor: ["#1d3552", "#e34e26", "#1f7eab", "#c1d5df"],
            data: this.technoPoint,
          },
        ],
      },

      // Configuration options go here
      options: {
        legend: {
          display: false,
        },

        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              // return data['datasets'][0]['data'][tooltipItem['index']]+' pts';
            },
            // afterLabel: function(tooltipItem, data) {
            //   return ' pts'
            // }
          },

          backgroundColor: "#fff",
          titleFontSize: 13,
          titleFontColor: "#1d3552",
          bodyFontColor: "#1d3552",
          bodyFontSize: 13,
          displayColors: false,
          footerMarginTop: "10",
          titleAlign: "center",
        },
      },
    });
  }*/

  SendQuestionSeleditd(id) {
    this.apiClientService
      .put(API_URI_CAMPAIGNS + "/" + id, {
        questions: this.questions,
      })
      .subscribe(
        (res) => {
          this.router.navigate([`/dashboard/campaigns/${res.id}/candidats`]);
          console.log(res);
        },
        (err) => console.log(err)
      );
  }

  editQuestionSelected() {
    for (const element of this.questions) {
      console.log("element: ", element);
      this.updateQuestionsCampaign.push(element.id);
    }
    console.log("this.updateQuestionsCampaign", this.updateQuestionsCampaign);
    this.apiClientService
      .put(API_URI_CAMPAIGNS + "/" + this.globalId, {
        questions: this.updateQuestionsCampaign,
      })
      .subscribe(
        (res) => {
          this.openSnackBar(
            "La campagne a correctement été mise à jour",
            "Fermer"
          );
          console.log("this.yourCampaign", this.yourCampaign[0]);
        },
        (err) => console.log(err)
      );
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  public onDecrementPage(): void {
    console.log('DECREMENT PAGE');
    this.decrementPage.emit(); // Déclenche l'output
  }

  postCampagne() {
    
    let truecp;

    if (this.formCampagne && this.formCampagne.value.utilisationCopieColler) {
      if (this.formCampagne.value.utilisationCopieColler === "true") {
        truecp = true;
      } else {
        truecp = false;
      }
      let envoiRapportSimplifie;
      if (this.formCampagne.value.envoiRapportSimplifie === "true") {
        envoiRapportSimplifie = true;
      } else {
        envoiRapportSimplifie = false;
      }

      this.apiClientService
        .post(API_URI_CAMPAIGNS, {
          Name: this.formCampagne.value.nomDeCampagne,
          level: this.formCampagne.value.experience,
          langs: this.formCampagne.value.langue,
          copy_paste: truecp,
          sent_report: envoiRapportSimplifie,
          profile: this.formCampagne.value.roleSelectedId,
          technologies: this.formCampagne.value.technoSelectedId,
          user: this.decryptTokenService.userId,
        })
        .subscribe(
          (res) => {
            // console.log("resultat from post", res);
            this.SendQuestionSeleditd(res.id);
            this.router.navigate([`/dashboard/campaigns/${res.id}/candidats`]);
            this.openSnackBar(
              "La campagne a correctement été enregistrée",
              "Fermer"
            );
          },
          (err) => console.log(err)
        );
    } else {
      this.editQuestionSelected();
    }
  }
}

export interface IHash {
  [details: string] : any;
}


