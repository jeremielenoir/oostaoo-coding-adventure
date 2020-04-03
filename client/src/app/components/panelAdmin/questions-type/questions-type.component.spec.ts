import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsTypeComponent } from './questions-type.component';

describe('QuestionsTypeComponent', () => {
  let component: QuestionsTypeComponent;
  let fixture: ComponentFixture<QuestionsTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
