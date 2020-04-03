import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatsMailComponent } from './candidats-mail.component';

describe('CandidatsMailComponent', () => {
  let component: CandidatsMailComponent;
  let fixture: ComponentFixture<CandidatsMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatsMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatsMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
