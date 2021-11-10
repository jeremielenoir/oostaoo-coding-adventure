import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { DecryptTokenService } from "src/app/components/home/register/register.service";

import {
  ApiClientService,
  API_URI_QUESTIONS,
  API_URI_CAMPAIGNS
} from "../../../../api-client/api-client.service";
import { Router } from "@angular/router";


@Component({
  selector: "app-NouvelleCampagnePage3Component",
  templateUrl: "./nouvelle-campagne3.component.html",
  styleUrls: [
    "./nouvelle-campagne3.component.scss"
  ]
})
export class NouvelleCampagnePage3Component implements OnInit {
  
  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  @Input('techno') techno: any
  
  public searchText = "";
  public experience: string;
  public questions: any[] = [];
  public saveallQuestionsCampaign: any[];
  public selectedQuestions: any[] = [];
  public notSelectedQuestions: any[] = [];
  public allQuestions: any[] = [];
  public finalCampagn = []

  public activeClassScrollTopDropList = false;
  public boelanIsSearchAdvenced = false;
  public toppingsDifficulty = new FormControl();
  public difficulty = ['facile', 'moyen', 'expert'];
  

  @ViewChild("droplist") public droplist: ElementRef;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
    }
  }
  constructor(public apiClientService: ApiClientService, public decryptTokenService: DecryptTokenService) { }

  ngOnInit() {
    this.experience = this.formCampagne.value.experience;
    this.getAllQuestions();
  } 

  fmtMSS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
  }

  headerChangePositioinDropList() {
    if (window.pageYOffset > 160) {
      this.activeClassScrollTopDropList = true;
    } else {
      this.activeClassScrollTopDropList = false;
    }
  }


   getAllQuestions() {
      let url: string = '';
      this.techno.forEach((tech,index)=>{
        if (index === 0) {
          url +=`?technologies_in=${tech.id}`
        } else {
          url +=`&technologies_in=${tech.id}`
        }
      })

      const MOCK_URL: string = '/api/questions?technologies_in=13555&technologies_in=13554&technologies_in=13561'
      // this.apiClientService.get(`${API_URI_QUESTIONS}${url}`).subscribe(datas => {
      this.apiClientService.get(MOCK_URL).subscribe(datas => {
        this.questions = [...datas];
        
        for (const question of this.questions) {
          if (question.technologies) {
              this.allQuestions.push(question);
          }
        }

        this.selectedQuestions = this.allQuestions.filter(questionLevel => (questionLevel.level === this.experience));
        this.notSelectedQuestions = [...this.allQuestions];
        
        for(let questionOfLevel of this.selectedQuestions){
          this.notSelectedQuestions = this.notSelectedQuestions.filter(question => question !== questionOfLevel);
        }
      });
      
  }

  chargeYourCampagn(event) {
    this.selectedQuestions = this.selectedQuestions.filter(q1 => this.notSelectedQuestions.findIndex(q2 => q1.id.toString ()=== q2.id.toString()) < 0)
  }

  public onDecrementPage(): void {
    this.decrementPage.emit(); // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit(); // Déclenche l'output
  }

  openSearchAdvenced() {
    this.boelanIsSearchAdvenced = !this.boelanIsSearchAdvenced
  }

  filtreDifficuty(element) {
    
    let test = 1;

    let results = [];

    if (element.value && element.value.length > 0) {
      this.allQuestions = this.saveallQuestionsCampaign;
      element.value.forEach(val => {
        console.log('value', val)
        let filterAtrray = this.allQuestions.filter(el => el.level == val);
        if (filterAtrray && filterAtrray.length > 0) {
          results = [...results, ...filterAtrray]

        }
      });

      this.allQuestions = results;

    } else {

      this.allQuestions = this.saveallQuestionsCampaign

    }


  }


}
@Component({
  selector: "popup-campaign",
  templateUrl: "popup-campaign.html",
  styleUrls: ["./popup-campaign.css"]
})
export class PopupCampaign {
  constructor(private bottomSheetRef: MatBottomSheetRef<PopupCampaign>) { }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
