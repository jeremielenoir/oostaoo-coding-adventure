import { Component, OnInit, Input,OnChanges, SimpleChanges } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-top-info-campagne',
  templateUrl: './top-info-campagne.component.html',
  styleUrls: ['./top-info-campagne.component.scss']
})
export class TopInfoCampagneComponent implements OnInit {

  @Input() formCampagne: FormGroup;
  @Input('allQuestionLevel') allQuestionLevel;
  @Input('yourCampaign') yourCampaign;
  @Input('techno') techno
  public globalId:number;
  public updateQuestionsCampaign:number[] = [];
  public technoDonuts:any[] = [];
  public poinTotal: number = 0;
  public timeAllquestionCampagn = 0;
  public timeAllquestionCampgnDivice = 0;
  public campagneFull = [];

  test = []


  constructor(public apiClientService: ApiClientService,private router: Router, 
    public decryptTokenService: DecryptTokenService,private _snackBar: MatSnackBar,private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {

    this.technoMethod();

    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
    });

    
   
  }

  ngOnChanges(changes: SimpleChanges){

    this.technoMethod();
    
    console.log('all question full',changes.allQuestionLevel.currentValue)
    
   
  }


  convertSecondsToMinutes(time){
    return Math.floor(time / 60);
  }

  technoMethod(){

    let pointDepart = 0;
    let poinTotal = null;
    let points = [];
    let timeArraySolo = [];
    let arraytimeAllquestionCampagn = [];
    let timeQuestionCampagne;
    let deparPointNumberQuestion = 0;
    let timeDepartQuestion = 0;    

      for(let timequestion of this.allQuestionLevel){
        console.log('timequestion --->',timequestion)
        arraytimeAllquestionCampagn.push(Number(timequestion.time));
      }

      for(let technoElement of this.techno){

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
      this.technoDonuts = this.technoDonuts.filter(element => element.value != 0)
      
      pointDepart = 0;
      deparPointNumberQuestion = 0;
      timeDepartQuestion = 0;
      
    }

    if(arraytimeAllquestionCampagn && arraytimeAllquestionCampagn.length > 0){
      this.timeAllquestionCampagn = arraytimeAllquestionCampagn.reduce((accumulator,currenValue) => accumulator + currenValue);
      this.timeAllquestionCampgnDivice = this.timeAllquestionCampagn / 2;
    }

    // console.log('timeAllquestionCampagn',this.timeAllquestionCampagn);

  }
  SendQuestionSeleditd(id) {
    this.apiClientService
      .put(API_URI_CAMPAIGNS + "/" + id, {
        questions: this.allQuestionLevel
      })
      .subscribe(
        res => {
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
        this.showSuccess('Les questions ont bien été éditées');
        console.log('this.yourCampaign',this.yourCampaign[0])
      },
      err => console.log(err)
    );
    
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  
  postCampagne() {
    // Confirm true for post

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
          },
          err => console.log(err)
        );
    }else{
      this.editQuestionSelected(); 
    }

  }




}
