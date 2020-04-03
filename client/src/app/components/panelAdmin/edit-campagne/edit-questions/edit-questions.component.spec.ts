import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionsComponent } from './edit-questions.component';

describe('EditQuestionsComponent', () => {
  let component: EditQuestionsComponent;
  let fixture: ComponentFixture<EditQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
