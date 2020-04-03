import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTypeComponent } from './one-type.component';

describe('OneTypeComponent', () => {
  let component: OneTypeComponent;
  let fixture: ComponentFixture<OneTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
