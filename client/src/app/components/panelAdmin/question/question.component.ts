import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormGroup } from "@angular/forms";
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
} from "../../../api-client/api-client.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-question-component",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss","../nouvelle-campagne/nouvelle-campagne.component.scss"]
})
export class QuestionComponent implements OnInit {
  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  @Input() datas = [];
  @Input() dataLevels = [];
  public searchText = "";
  public experience: string;
  public questions: any[];
  
  public activeClassScrollTopDropList = false;
  
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
    private router: Router
  ) {}

  ngOnInit() {
    console.log("this.dataLevels : ", this.dataLevels);
   // this.getAllQuestions();

    window.scroll(10, 0);

   // this.experience = this.formCampagne.value.experience;

    // let body = document.querySelector('body');

    window.addEventListener("scroll", () => {
      this.headerChangePositioinDropList();
    });
  }
  fmtMSS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    return (
      ("0" + h).slice(-2) +
      ":" +
      ("0" + m).slice(-2) +
      ":" +
      ("0" + s).slice(-2)
    );
  }

  headerChangePositioinDropList() {
    if (window.pageYOffset > 160) {
      this.activeClassScrollTopDropList = true;
    } else {
      this.activeClassScrollTopDropList = false;
    }
  }

  

  SendQuestionSelected(id) {
    this.apiClientService
      .put(API_URI_CAMPAIGNS + "/" + id, {
        questions: this.dataLevels
      })
      .subscribe(
        res => {
          console.log(res);
        },
        err => console.log(err)
      );
  }

  public onDecrementPage(): void {
    this.decrementPage.emit(); // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit(); // Déclenche l'output
  }

  postCampagne() {
    // Confirm true for post
    let truecp;
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
          console.log("resultat from post", res);
          this.SendQuestionSelected(res.id);
          this.router.navigate([`/dashboard/campaigns/${res.id}/candidats`]);
        },
        err => console.log(err)
      );
  }
}

// @Component({
//   selector: "popup-campaign",
//   templateUrl: "popup-campaign.html",
//   styleUrls: ["./popup-campaign.css"]
// })
// export class PopupCampaign {
//   constructor(private bottomSheetRef: MatBottomSheetRef<PopupCampaign>) {}

//   openLink(event: MouseEvent): void {
//     this.bottomSheetRef.dismiss();
//     event.preventDefault();
//   }
// }
