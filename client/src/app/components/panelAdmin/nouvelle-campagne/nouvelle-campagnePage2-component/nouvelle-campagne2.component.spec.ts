import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCampagnePage2Component } from './nouvelle-campagne2.component';

describe('NouvelleCampagne2Component', () => {
  let component: NouvelleCampagnePage2Component;
  let fixture: ComponentFixture<NouvelleCampagnePage2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvelleCampagnePage2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleCampagnePage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
