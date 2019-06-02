import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationComponent } from './facturation.component';

describe('FacturationComponent', () => {
  let component: FacturationComponent;
  let fixture: ComponentFixture<FacturationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
