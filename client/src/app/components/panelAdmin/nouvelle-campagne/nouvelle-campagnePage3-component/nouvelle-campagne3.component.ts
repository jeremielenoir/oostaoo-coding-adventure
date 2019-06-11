import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

import { ApiClientService, API_URI_QUESTIONS } from '../../../../api-client/api-client.service';


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
  QuestionsSelected = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  constructor(private bottomSheet: MatBottomSheet, public apiClientService: ApiClientService) { }

  openBottomSheet(): void {
    this.bottomSheet.open(PopupCampaign);
  }


  ngOnInit() {
    this.apiClientService.get(API_URI_QUESTIONS).subscribe((datas) => {
      this.questions = datas;
      for (var i = 0; i < this.questions.length; i++) {
        if (this.formCampagne.value.technoSelectedId.includes(this.questions[i].technologies.id)) {
          // console.log(this.questions[i].technologies.name)
          // console.log(this.questions[i])
          this.Questions.push(this.questions[i]);
        }
      }
    });
    console.log("questions ", this.Questions);
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
