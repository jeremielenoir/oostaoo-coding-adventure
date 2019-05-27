import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompagneComponent } from './compagne.component';

describe('CompagneComponent', () => {
  let component: CompagneComponent;
  let fixture: ComponentFixture<CompagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompagneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
