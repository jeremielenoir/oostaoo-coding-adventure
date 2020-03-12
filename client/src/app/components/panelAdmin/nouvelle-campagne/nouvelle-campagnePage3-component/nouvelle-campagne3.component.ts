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
    "./nouvelle-campagne3.component.scss",
    "../nouvelle-campagne.component.scss"
  ]
})
export class NouvelleCampagnePage3Component implements OnInit {
  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  
  @Input('techno') techno: any
  public searchText = "";
  public experience: string;
  public questions: any[];
  public saveallQuestionsCampaign: any[];
  public allQuestionLevel: any[] = [];
  public allQuestions: any[] = [];
  public allTechno: any = [];

  public activeClassScrollTopDropList = false;
  public boelanIsSearchAdvenced = false;
  public toppingsDifficulty = new FormControl();
  public difficulty = ['facile', 'moyen', 'expert'];
  

  Questions = [];

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
      // console.log("all question: ", this.allQuestions);
      // console.log("this Question: ", this.Questions)
    }
  }
  constructor(
    public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.experience =  this.formCampagne.value.experience;
    this.getAllQuestions();

    console.log('les question total -->',this.allQuestions)

    window.scroll(10, 0);

    window.addEventListener("scroll", () => {
      this.headerChangePositioinDropList();
    });
  }

  experiencecampagn(){

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
    // console.log('this.formCampagne.value(): ', this.formCampagne.value);
    this.apiClientService.get(API_URI_QUESTIONS).subscribe(datas => {
      this.questions = datas;
      for (const question of this.questions) {
        if (question.technologies) {

          if (this.formCampagne.value.technoSelectedId.includes(question.technologies.id)
          ) {
            this.allTechno.push(question.technologies.name)
            this.allQuestions.push(question);
            this.saveallQuestionsCampaign = this.allQuestions
          }

        }

      }

      console.log('les data question de allQuestions--->',this.allQuestions)

      for (const questionLevel of this.allQuestions) {
        if (questionLevel.level === this.experience) {
          console.log('all question trie expert --->',questionLevel.level)
          this.allQuestionLevel.push(questionLevel);
        }
      }

      console.log('question lvl -->',this.experience)

      console.log('les data question de allQuestionLevel --->',this.allQuestionLevel)


      for (const itemQuestionLevel of this.allQuestionLevel) {
        this.allQuestions = this.allQuestions.filter(
          element => element !== itemQuestionLevel
        );
      }
    });
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
    console.log('saveallQuestionsCampaign', this.saveallQuestionsCampaign)
    let test = 1;
    console.log('---hell word ---', test + 1);

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
