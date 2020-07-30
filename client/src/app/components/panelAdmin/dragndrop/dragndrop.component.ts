import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Inject,
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { DecryptTokenService } from "src/app/components/home/register/register.service";

import {
  ApiClientService,
  API_URI_QUESTIONS,
  API_URI_CAMPAIGNS,
} from "../../../api-client/api-client.service";
import { Router } from "@angular/router";
import { TestComponent } from "../client-test/test/test.component";
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

export interface DialogData {
  questions;
}

@Component({
  selector: "app-dragndrop-component",
  templateUrl: "./dragndrop.component.html",
  styleUrls: [
    "./dragndrop.component.scss"
  ],
})
export class DragNDropComponent implements OnInit {
  @Input("formCampagne") formCampagne: FormGroup;
  @Input() notSelectedQuestions = [];
  @Input() selectedQuestions = [];
  @Input() techno = [];
  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Output() chargeYourCampagn = new EventEmitter<any>();
  public searchText = "";
  public experience: string;
  public questions: any[];

  public toppingsDifficulty = new FormControl();
  public boelanIsSearchAdvenced: boolean = false;
  public saveallQuestionsCampaign = [];
  public yourCampaign;
  public difficulty = ["facile", "moyen", "expert"];
  public booleanCampagnFinishLoading: boolean;
  public activeClassScrollTopDropList = false;
  public Questions = [];

  public disablehover = false;
  public enablehover = false;
  public technoCampaign: Array<any>;
  public name_i18n:any = '';
  public content_i18n:any = ''
  public theme_i18n:any = ''
  public answer_value_i18n:any = ''
  @ViewChild("droplist") public droplist: ElementRef;

  dragStart(event: CdkDragDrop<string[]>) {
    console.log("event start", event);
    this.disablehover = true;
  }

  dragEnd(event: CdkDragDrop<string[]>) {
    console.log("event finish", event);
    this.disablehover = false;
  }

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
      const previous = event.previousContainer.data;
      const current = event.container.data;
      const diff = current.filter((p) => !previous.includes(p));

      this.chargeYourCampagn.emit(diff);
      // console.log("all question: ", this.allQuestions);
      // console.log("this Question: ", this.Questions)
    }
  }
  constructor(
    public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    public languageStorage:SelectedLanguageService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {

    switch(this.languageStorage.getLanguageCountry()){
      case 'es-ES':
        this.name_i18n =  'name_es';
        this.content_i18n = 'content_es';
        this.answer_value_i18n ='answer_value_es';
        this.theme_i18n ='theme_es'
      break;
      case 'fr-FR':
        this.name_i18n =  'name';
        this.content_i18n = 'content';
        this.answer_value_i18n ='answer_value';
        this.theme_i18n ='theme'
      break;
      case 'en-US':
        this.name_i18n =  'name_en';
        this.content_i18n = 'content_en';
        this.answer_value_i18n ='answer_value_en';
        this.theme_i18n ='theme_en'
      break;
      case 'jp-JP':
        this.name_i18n =  'name_jp';
        this.content_i18n = 'content_jp';
        this.answer_value_i18n ='answer_value_jp';
        this.theme_i18n ='theme_jp'
      break;
      default:
        this.content_i18n = 'content';
        this.name_i18n =  'name';
        this.answer_value_i18n ='answer_value';
        this.theme_i18n ='theme'
    }
     

    console.log("this.content_i18n ",this.content_i18n )
    console.log("this.name_i18n ",this.name_i18n )
    this.methoddataLevels();

    window.scroll(10, 0);

    window.addEventListener("scroll", () => {
      this.headerChangePositioinDropList();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("aerorpt man -->", changes.selectedQuestions);
    if (this.selectedQuestions && this.selectedQuestions.length > 0) {
      this.booleanCampagnFinishLoading = true;
    }
  }

  addquestion(question) {
    this.selectedQuestions.push(question);
    const index = this.notSelectedQuestions.indexOf(question);
    if (index > -1) {
      this.notSelectedQuestions.splice(index, 1);
    }
    this.chargeYourCampagn.emit([...this.selectedQuestions,question]);
  }

  methoddataLevels() {
    // this.notSelectedQuestions = this.selectedQuestions;
    // console.log('data ---> trie',this.notSelectedQuestions)
  }

  fmtMSS(d) {
    d = Number(d);
    // var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    return ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
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
        questions: this.selectedQuestions,
      })
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => console.log(err)
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
        user: this.decryptTokenService.userId,
      })
      .subscribe(
        (res) => {
          console.log("resultat from post", res);
          this.SendQuestionSelected(res.id);
          this.router.navigate([`/dashboard/campaigns/${res.id}/candidats`]);
        },
        (err) => console.log(err)
      );
  }

  openSearchAdvenced() {
    this.boelanIsSearchAdvenced = !this.boelanIsSearchAdvenced;
  }

  // data: {questions: this.selectedQuestions}
  openDialogTest(): void {
    const dialogRef = this.dialog.open(DialogOverviewTest, {
      data: { questions: this.selectedQuestions, technoCampaign: this.techno },
      width: "400px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  // filtreTechno(element) {

  //   const valueChecked = [];

  //   element.value.forEach(valueCheck => {
  //     if (valueChecked.includes(valueCheck)) {

  //       for (let value of valueChecked) {
  //         let newFilter = this.notSelectedQuestions.filter(element => element.technologies.name == value);
  //         this.notSelectedQuestions = newFilter
  //       }

  //     } else {
  //       valueChecked.push(valueCheck);
  //     }
  //   });

  //   console.log('allquestion---------->', this.notSelectedQuestions)

  // }
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

@Component({
  selector: "dialog-overview-test",
  templateUrl: "dialog-overview-test.html",
})
export class DialogOverviewTest implements OnInit {
  dataPopup;
  prev = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewTest>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data) {
      this.dataPopup = data;
      this.prev = true;
    }
  }

  ngOnInit() {
    console.log("this.dataPopup : ", this.dataPopup);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }
  refreshComponent($event): void {
    console.log("REFRESH COMPONENT");
  }
}
