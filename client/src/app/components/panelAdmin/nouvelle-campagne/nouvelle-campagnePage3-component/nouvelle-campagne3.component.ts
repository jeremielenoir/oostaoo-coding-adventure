import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';

import {
  ApiClientService,
  API_URI_QUESTIONS,
  API_URI_CAMPAIGNS
} from '../../../../api-client/api-client.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-NouvelleCampagnePage3Component',
  templateUrl: './nouvelle-campagne3.component.html',
  styleUrls: [
    './nouvelle-campagne3.component.scss'
  ]
})
export class NouvelleCampagnePage3Component implements OnInit {

  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  @Input('techno') techno: any;

  public searchText = '';
  public experience: string;
  public questions: any[] = [];
  public saveallQuestionsCampaign: any[];
  public selectedQuestions: any[] = [];
  public notSelectedQuestions: any[] = [];
  public allQuestions: any[] = [];
  public finalCampagn = [];

  public activeClassScrollTopDropList = false;
  public boelanIsSearchAdvenced = false;
  public toppingsDifficulty = new FormControl();
  public difficulty = ['facile', 'moyen', 'expert'];


  @ViewChild('droplist') public droplist: ElementRef;

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
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
  }

  headerChangePositioinDropList() {
    if (window.pageYOffset > 160) {
      this.activeClassScrollTopDropList = true;
    } else {
      this.activeClassScrollTopDropList = false;
    }
  }


   getAllQuestions() {
      let url = '';
      this.techno.forEach((tech, index) => {
        if (index === 0) {
          url += `?technologies_in=${tech.id}`;
        } else {
          url += `&technologies_in=${tech.id}`;
        }
      });

      this.apiClientService.get(`${API_URI_QUESTIONS}${url}`).subscribe(datas => {
        this.questions = [...datas];

        for (const question of this.questions) {
          if (question.technologies) {
              this.allQuestions.push(question);
          }
        }

        this.selectedQuestions = this.percentQuestionsByLevel(this.experience, this.allQuestions);
        this.notSelectedQuestions = [...this.allQuestions];

        for (const questionOfLevel of this.selectedQuestions) {
          this.notSelectedQuestions = this.notSelectedQuestions.filter(question => question !== questionOfLevel);
        }
      });

  }

  private percentQuestionsByLevel(selectedLevel: string, questions: Record<string, any>[]): Record<string, any>[] {
    const minTestTime = 20; // 20 min
    const maxTestTime = 30; // 30 min

    // tests need to be between 20min to 30min
    const testTime: number = Math.floor(minTestTime + Math.random() * (maxTestTime + 1 - minTestTime));
    // convert test time in seconds because question time (in DB) is in second
    const testTimeSeconds: number = testTime * 60;

    // questions are selected in 60%/20%/20% according to the provided level
    // if selected level is “moyen“ then 60% of selected questions will be “moyen“ level
    // the left are split in 20% “facile“ level and 20% “expert“ level or inversely
    const sixtyPer: number = Math.round((60 * testTimeSeconds) / 100);
    const twentyPer: number = Math.round((testTimeSeconds - sixtyPer) / 2);

    // In these 2 array, index position of each values are not correlated
    let levels: string[] = ['facile', 'moyen', 'expert'];

    const timeLevels: Record<string, any>[] = [];
    timeLevels.push({level: selectedLevel, time: sixtyPer});

    const y: number = levels.length - 1;
    for (let i = 0; i < y; i++) {
      levels = levels.filter(level => level !== timeLevels[i].level);

      timeLevels.push({
        level: levels[Math.floor(Math.random() * levels.length)],
        time: twentyPer
      });
    }

    questions = questions.sort(() => Math.random() - 0.5); // shuffle questions before looping

    const selectedQuestions: Record<string, any>[] = [];
    let idxQuestion = 0;

    while (true) {
      // loop will break once time in each level has reached 0 or no more questions
      if (!(timeLevels.map(timeLevel => timeLevel.time > 0).includes(true)) || (idxQuestion === questions.length - 1)) {
        break;
      }

      const question: Record<string, any> = questions[idxQuestion];

      timeLevels.forEach(timeLevel => {
        if (timeLevel.level === question.level && timeLevel.time > 0) {
          selectedQuestions.push(question);
          timeLevel.time -= question.time;
        }
        return timeLevel;
      });

      idxQuestion += 1; // increment to get to the next question
    }

    return selectedQuestions;
  }

  chargeYourCampagn(event) {
    this.selectedQuestions = this.selectedQuestions.filter(q1 => this.notSelectedQuestions.findIndex(q2 => q1.id.toString() === q2.id.toString()) < 0);
  }

  public onDecrementPage(): void {
    this.decrementPage.emit(); // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit(); // Déclenche l'output
  }

  openSearchAdvenced() {
    this.boelanIsSearchAdvenced = !this.boelanIsSearchAdvenced;
  }

  filtreDifficuty(element) {
    const test = 1;
    let results = [];

    if (element.value && element.value.length > 0) {
      this.allQuestions = this.saveallQuestionsCampaign;
      element.value.forEach(val => {
        console.log('value', val);
        const filterAtrray = this.allQuestions.filter(el => el.level == val);
        if (filterAtrray && filterAtrray.length > 0) {
          results = [...results, ...filterAtrray];

        }
      });

      this.allQuestions = results;
    } else {
      this.allQuestions = this.saveallQuestionsCampaign;
    }
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
