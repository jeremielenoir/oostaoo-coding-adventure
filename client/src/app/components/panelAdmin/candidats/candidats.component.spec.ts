import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Candidats } from './candidats.component';

describe('CandidatsComponent', () => {
  let component: Candidats;
  let fixture: ComponentFixture<Candidats>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Candidats]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Candidats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
