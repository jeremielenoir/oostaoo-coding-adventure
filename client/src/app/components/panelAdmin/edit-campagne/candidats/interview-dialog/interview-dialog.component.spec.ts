import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewDialogComponent } from './interview-dialog.component';

describe('InterviewDialogComponent', () => {
  let component: InterviewDialogComponent;
  let fixture: ComponentFixture<InterviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
