import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';

import { ApiClientService, API_URI_QUESTIONS, API_URI_CAMPAIGNS } from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-NouvelleCampagnePage3Component',
  templateUrl: './nouvelle-campagne3.component.html',
  styleUrls: ['./nouvelle-campagne3.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage3Component implements OnInit {
  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public searchText = '';
  public experience: string;
  public questions: any[];
  public allQuestionLevel: any[] = [];
  public activeClassScrollTopDropList = false;

  Questions = [];
  allQuestions = [];

  @ViewChild('droplist') public droplist: ElementRef;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      // console.log("all question: ", this.allQuestions);
      // console.log("this Question: ", this.Questions)
    }
  }
  constructor(public apiClientService: ApiClientService,  public decryptTokenService: DecryptTokenService) { }


  ngOnInit() {
    console.log('this.allQuestionLevel : ', this.allQuestionLevel);
    this.getAllQuestions();

    window.scroll(10, 0);

    this.experience = this.formCampagne.value.experience;

    // let body = document.querySelector('body');

    window.addEventListener('scroll', () => {

      this.headerChangePositioinDropList();

    });
  }
  fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
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
    this.apiClientService.get(API_URI_QUESTIONS).subscribe((datas) => {
      this.questions = datas;
      for (const question of this.questions) {
        // console.log('question.technologies.id: ', question.technologies.id);
        if (this.formCampagne.value.technoSelectedId.includes(question.technologies.id)) {
          this.allQuestions.push(question);
        }
      }

      for (const questionLevel of this.allQuestions) {
        if (questionLevel.level === this.experience) {
          this.allQuestionLevel.push(questionLevel);
        }
      }

      for (const itemQuestionLevel of this.allQuestionLevel) {
        this.allQuestions = this.allQuestions.filter(element => element !== itemQuestionLevel);
      }
    });
  }

  SendQuestionSelected(id) {
    this.apiClientService.put(API_URI_CAMPAIGNS + '/' + id, {
      questions: this.allQuestionLevel
    }).subscribe(
      (res) => {
        console.log(res);
      },
      err => console.log(err)
    );
  }

  public onDecrementPage(): void {
    this.decrementPage.emit();  // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit();  // Déclenche l'output
  }

  postCampagne() {
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

    this.apiClientService.post(API_URI_CAMPAIGNS, {
      Name: this.formCampagne.value.nomDeCampagne,
      level: this.formCampagne.value.experience,
      langs: this.formCampagne.value.langue,
      copy_paste: truecp,
      sent_report: envoiRapportSimplifie,
      profile: this.formCampagne.value.roleSelectedId,
      technologies: this.formCampagne.value.technoSelectedId,
      user: this.decryptTokenService.userId
    }).subscribe(
      (res) => {
        console.log('resultat from post', res);
        this.SendQuestionSelected(res.id);
      },
      err => console.log(err)
    );
  }
}

@Component({
  selector: 'popup-campaign',
  templateUrl: 'popup-campaign.html',
  styleUrls: ['./popup-campaign.css']
})
export class PopupCampaign {
  constructor(private bottomSheetRef: MatBottomSheetRef<PopupCampaign>) { }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
