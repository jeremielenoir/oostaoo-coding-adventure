import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

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

  public questions: any[];

  Questions = [];
  allQuestions = [];
  QuestionsCampaign = [];

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
  constructor(public apiClientService: ApiClientService) { }


  ngOnInit() {
    this.apiClientService.get(API_URI_QUESTIONS).subscribe((datas) => {
      this.questions = datas;
      for (var i = 0; i < this.questions.length; i++) {
        if (this.formCampagne.value.technoSelectedId.includes(this.questions[i].technologies.id)) {
          this.allQuestions.push(this.questions[i]);
        }
      }
    });
    setTimeout(() => {
      this.apiClientService.get(API_URI_CAMPAIGNS + '/' + this.formCampagne.value.CampaignID.id).subscribe((datas) => {
        console.log('resultat from get', datas);
      });
    }, 1000);
  }

  SendQuestionSelected() {
    for (let index = 0; index < this.Questions.length; index++) {
      const element = this.Questions[index];
      this.QuestionsCampaign.push(element['id']);
    }
    // console.log("this array for update questions", this.QuestionsCampaign)
    this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.formCampagne.value.CampaignID.id, {
      questions: this.QuestionsCampaign
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