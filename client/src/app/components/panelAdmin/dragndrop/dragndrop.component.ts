import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';

import {
  API_URI_CAMPAIGNS,
  ApiClientService,
} from '../../../api-client/api-client.service';

import { Router } from '@angular/router';

import { SelectedLanguageService } from 'src/app/services/selected-language.service';

export interface IDialogData {
  questions: any;
}

@Component({
  selector: 'app-dialog-overview-test',
  templateUrl: 'dialog-overview-test.html',
  styleUrls: ['./dialog-overview-test.scss'],
})
export class DialogOverviewTestComponent implements OnInit {
  dataPopup;
  prev = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) {
    if (data) {
      this.dataPopup = data;
      this.prev = true;
    }
  }

  ngOnInit() {
    console.log('this.dataPopup : ', this.dataPopup);
  }
}

@Component({
  selector: 'app-dragndrop-component',
  styleUrls: ['./dragndrop.component.scss'],
  templateUrl: './dragndrop.component.html',
})
export class DragNDropComponent implements OnInit, OnChanges {
  @Input() public formCampagne: FormGroup;
  @Input() public notSelectedQuestions = [];
  @Input() public selectedQuestions = [];
  @Input() public techno = [];
  @Output() public incrementPage = new EventEmitter<any>();
  @Output() public decrementPage = new EventEmitter<any>();
  @Output() public chargeYourCampagn = new EventEmitter<any>();
  public searchText = '';
  public experience: string;
  public questions: any[];
  public toppingsDifficulty = new FormControl();
  public boelanIsSearchAdvenced = false;
  public saveallQuestionsCampaign = [];
  public yourCampaign;
  public difficulty = ['facile', 'moyen', 'expert'];
  public isLoaded: boolean;
  public activeClassScrollTopDropList = false;
  public Questions = [];
  public disablehover = false;
  public enablehover = false;
  public technoCampaign = [];
  public nameI18n = '';
  public contentI18n = '';
  public themeI18n = '';
  public titreI18n = '';
  public answerValueI18n = '';
  @ViewChild('droplist') public droplist: ElementRef;

  constructor(
    public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    public languageStorage: SelectedLanguageService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  public dragStart(event: CdkDragDrop<string[]>) {
    console.log('event start', event);
    this.disablehover = true;
  }

  public dragEnd(event: CdkDragDrop<string[]>) {
    console.log('event finish', event);
    this.disablehover = false;
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const previous = event.previousContainer.data;
      const current = event.container.data;
      const diff = current.filter((p) => !previous.includes(p));
      this.chargeYourCampagn.emit(diff);
    }
  }

  public ngOnInit() {
    switch (this.languageStorage.getLanguageCountry()) {
      case 'es-ES':
        this.nameI18n = 'name_es';
        this.contentI18n = 'content_es';
        this.answerValueI18n = 'answer_value_es';
        this.themeI18n = 'theme_es';
        this.titreI18n = 'titre_es';
        break;
      case 'fr-FR':
        this.nameI18n = 'name';
        this.contentI18n = 'content';
        this.answerValueI18n = 'answer_value';
        this.themeI18n = 'theme';
        this.titreI18n = 'titre_fr';
        break;
      case 'en-US':
        this.nameI18n = 'name_en';
        this.contentI18n = 'content_en';
        this.answerValueI18n = 'answer_value_en';
        this.themeI18n = 'theme_en';
        this.titreI18n = 'titre_en';
        break;
      case 'jp-JP':
        this.nameI18n = 'name_jp';
        this.contentI18n = 'content_jp';
        this.answerValueI18n = 'answer_value_jp';
        this.themeI18n = 'theme_jp';
        this.titreI18n = 'titre_jp';
        break;
      default:
        this.contentI18n = 'content';
        this.nameI18n = 'name';
        this.answerValueI18n = 'answer_value';
        this.themeI18n = 'theme';
        this.titreI18n = 'titre';
    }

    window.scroll(10, 0);
    window.addEventListener('scroll', () => {
      this.headerChangePositioinDropList();
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.selectedQuestions && this.selectedQuestions.length > 0) {
      this.isLoaded = true;
    }
  }

  public log(info: HTMLElement) {
    console.log('INFO', info.classList.add('machin'));
  }

  public addquestion(question) {
    this.selectedQuestions.unshift(question);
    // this.selectedQuestions = [question, ...this.selectedQuestions];
    console.log([question, ...this.selectedQuestions]);

    const index = this.notSelectedQuestions.indexOf(question);
    if (index > -1) {
      this.notSelectedQuestions.splice(index, 1);
    }
    this.chargeYourCampagn.emit([...this.selectedQuestions, question]);
  }

  public fmtMSS(d: number) {
    d = Number(d);
    // var h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
  }

  public headerChangePositioinDropList() {
    if (window.pageYOffset > 160) {
      this.activeClassScrollTopDropList = true;
    } else {
      this.activeClassScrollTopDropList = false;
    }
  }

  public SendQuestionSelected(id) {
    this.apiClientService
      .put(API_URI_CAMPAIGNS + '/' + id, {
        questions: this.selectedQuestions,
      })
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => console.log(err),
      );
  }

  public onDecrementPage(): void {
    this.decrementPage.emit(); // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit(); // Déclenche l'output
  }

  public postCampagne() {
    // Confirm true for post
    let truecp;
    if (this.formCampagne.value.utilisationCopieColler === 'true') {
      truecp = true;
    } else {
      truecp = false;
    }
    let envoiRapportSimplifie;
    if (this.formCampagne.value.envoiRapportSimplifie === 'true') {
      envoiRapportSimplifie = true;
    } else {
      envoiRapportSimplifie = false;
    }

    this.apiClientService
      .post(API_URI_CAMPAIGNS, {
        Name: this.formCampagne.value.nomDeCampagne,
        copy_paste: truecp,
        langs: this.formCampagne.value.langue,
        level: this.formCampagne.value.experience,
        profile: this.formCampagne.value.roleSelectedId,
        sent_report: envoiRapportSimplifie,
        technologies: this.formCampagne.value.technoSelectedId,
        user: this.decryptTokenService.userId,
      })
      .subscribe(
        (res) => {
          console.log('resultat from post', res);
          this.SendQuestionSelected(res.id);
          this.router.navigate([`/dashboard/campaigns/${res.id}/candidats`]);
        },
        (err) => console.log(err),
      );
  }

  public openSearchAdvenced() {
    this.boelanIsSearchAdvenced = !this.boelanIsSearchAdvenced;
  }

  // data: {questions: this.selectedQuestions}
  public openDialogTest(question?: any): void {
    const dialogRef = this.dialog.open(DialogOverviewTestComponent, {
      data: {
        questions: question ? [question] : this.selectedQuestions,
        technoCampaign: this.techno,
      },
      height: '90vh',
      maxHeight: '90vh',
      maxWidth: '90vw',
      panelClass: 'dialog-test',
      width: '90vw',
    });

    dialogRef.afterClosed().subscribe();
  }
}
