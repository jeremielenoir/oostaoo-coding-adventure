import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatsFormComponent } from './candidats-form.component';

describe('CandidatsFormComponent', () => {
  let component: CandidatsFormComponent;
  let fixture: ComponentFixture<CandidatsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
