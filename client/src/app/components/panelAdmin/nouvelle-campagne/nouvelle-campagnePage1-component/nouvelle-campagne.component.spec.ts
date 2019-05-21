import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCampagnePage1Component } from './nouvelle-campagne.component';

describe('NouvelleCampagneComponent', () => {
  let component: NouvelleCampagnePage1Component;
  let fixture: ComponentFixture<NouvelleCampagnePage1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvelleCampagnePage1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleCampagnePage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
