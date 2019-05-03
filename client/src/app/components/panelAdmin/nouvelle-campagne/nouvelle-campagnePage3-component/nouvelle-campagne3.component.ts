import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';


@Component({
  selector: 'app-NouvelleCampagnePage3Component',
  templateUrl: './nouvelle-campagne3.component.html',
  styleUrls: ['./nouvelle-campagne3.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage3Component implements OnInit {
  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

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
  constructor(private bottomSheet: MatBottomSheet) { }

  openBottomSheet(): void {
    this.bottomSheet.open(PopupCampaign);
  }


  ngOnInit() {
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
