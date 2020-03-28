import { Component, OnInit, Input,OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import {FormGroup} from '@angular/forms';
import {
  ApiClientService,
  API_URI_QUESTIONS,
  API_URI_CAMPAIGNS
} from "../../../api-client/api-client.service";
import { Router } from "@angular/router";
import { DecryptTokenService } from "src/app/components/home/register/register.service";
import { TooltipPosition, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-top-info-campagne',
  templateUrl: './top-info-campagne.component.html',
  styleUrls: ['./top-info-campagne.component.scss']
})
export class TopInfoCampagneComponent implements OnInit {

  @Input() formCampagne: FormGroup;
  @Input() allQuestionLevel;
  @Input() yourCampaign;
  @Input() techno;
  public globalId:number;
  public updateQuestionsCampaign:number[] = [];
  public technoDonuts:any[] = [];
  public elementDonnut: any;
  public poinTotal: number = 0;
  public timeAllquestionCampagn = 0;
  public timeAllquestionCampgnDivice = 0;
  public campagneFull = [];
  public technoLabel = [];
  public technoPoint = []
  @ViewChild('Chart') Chart: ElementRef;

  constructor(public apiClientService: ApiClientService,private router: Router, 
    public decryptTokenService: DecryptTokenService,private _snackBar: MatSnackBar,private route: ActivatedRoute) { }

  ngOnInit() {


    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
    });

  }

  ngOnChanges(changes: SimpleChanges){

    console.log('change man le changement -->',changes.allQuestionLevel)

    this.technoMethod();
    
    console.log('all changement campagn',changes)

  }

  convertSecondsToMinutes(time){
    return Math.floor(time / 60);
  }

  technoMethod(){

    let pointDepart = 0;
    let points = [];
    let timeArraySolo = [];
    let arraytimeAllquestionCampagn = [];
    let timeQuestionCampagne;
    let deparPointNumberQuestion = 0;
    let timeDepartQuestion = 0;    

    if(this.allQuestionLevel && this.allQuestionLevel.length > 0){
      for(let timequestion of this.allQuestionLevel){
        arraytimeAllquestionCampagn.push(Number(timequestion.time));
      }
    }

      for(let technoElement of this.techno){

        console.log('les techno demande -->',technoElement)

        for(let question of this.allQuestionLevel){
          
            if(technoElement['id'] == question['technologies'].id){
              pointDepart = pointDepart + question['points'];
              timeDepartQuestion = timeDepartQuestion + question['time'];
              deparPointNumberQuestion++
              
            }
      }
     
      points.push(pointDepart);
      timeArraySolo.push(timeDepartQuestion)
     
      points  = points.filter(element => element !== 0);
      if(points && points.length > 0 ){
        this.poinTotal = points.reduce((accumulator,currenValue) => accumulator + currenValue)
      }

      
       timeQuestionCampagne = 0;
       
     
      this.technoDonuts.push(
        {
          label:technoElement['name'],
          value:pointDepart,
          question:deparPointNumberQuestion,
          timeQuestion:timeDepartQuestion,
          timeQuestionDIvice:timeDepartQuestion / 2
          
        }
        );
      this.technoDonuts = this.technoDonuts.filter(element => element.value != 0);
      
      pointDepart = 0;
      deparPointNumberQuestion = 0;
      timeDepartQuestion = 0;
      
    }

    if(arraytimeAllquestionCampagn && arraytimeAllquestionCampagn.length > 0){
      this.timeAllquestionCampagn = arraytimeAllquestionCampagn.reduce((accumulator,currenValue) => accumulator + currenValue);
      this.timeAllquestionCampgnDivice = this.timeAllquestionCampagn / 2;
    }


    for(let tech of this.technoDonuts){
        this.technoLabel.push(tech.label);
        this.technoPoint.push(tech.value)
    }

    this.elementDonnut =  this.Chart.nativeElement.getContext('2d');

    let chart = new Chart(this.elementDonnut, {
      type: 'doughnut',
  
      data: {
          labels: this.technoLabel,
          datasets: [
            {
              label: 'diagram',
              backgroundColor: ['#1d3552','#e34e26','#1f7eab','#c1d5df'],
              borderColor: ['#1d3552','#e34e26','#1f7eab','#c1d5df'],
              data: this.technoPoint
            }
        ]
      },
  
      // Configuration options go here
      options: {
        legend: {
          display: false
       },
       
       tooltips: {
       
        callbacks: {
          title: function(tooltipItem, data) {
            return data['labels'][tooltipItem[0]['index']];
          },
          label: function(tooltipItem, data) {
            // return data['datasets'][0]['data'][tooltipItem['index']]+' pts';
          },
          // afterLabel: function(tooltipItem, data) {
          //   return ' pts'
          // }
        },

        backgroundColor: '#fff',
        titleFontSize: 13,
        titleFontColor: '#1d3552',
        bodyFontColor: '#1d3552',
        bodyFontSize: 13,
        displayColors: false,
        footerMarginTop:'10',
        titleAlign:'center',
       
       },
    
      }
  });


  }
  SendQuestionSeleditd(id) {
    this.apiClientService
      .put(API_URI_CAMPAIGNS + "/" + id, {
        questions: this.allQuestionLevel
      })
      .subscribe(
        
        res => {
          this.router.navigate([`/dashboard/campaigns/${res.id}/candidats`])
          console.log(res);
        },
        err => console.log(err)
      );
  }

  editQuestionSelected() {
    for (const element of this.allQuestionLevel) {
      console.log('element: ', element);
      this.updateQuestionsCampaign.push(element.id);
    }
    this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.globalId, {
      questions: this.updateQuestionsCampaign
    }).subscribe(
      (res) => {
        this.openSnackBar("La campagne a correctement été mise à jour", "Fermer");
        console.log('this.yourCampaign',this.yourCampaign[0])
      },
      err => console.log(err)
    );
    
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }
  
  postCampagne() {
    // Confirm true for post

    // if(this.yourCampaign[0] == undefined){
    //   this.SendQuestionSeleditd(this.yourCampaign[0].id);
    //   return
    // }

    let truecp;

    if(this.formCampagne && this.formCampagne.value.utilisationCopieColler){
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
          user: this.decryptTokenService.userId
        })
        .subscribe(
          res => {
           
            // console.log("resultat from post", res);
            this.SendQuestionSeleditd(res.id);
            this.router.navigate([`/dashboard/campaigns/${res.id}/candidats`])
            this.openSnackBar("La campagne a correctement été enregistrée", "Fermer");
          },
          err => console.log(err)
        );
    }else{
      this.editQuestionSelected(); 
    }

  }
}
