import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCampagne3Component } from './nouvelle-campagne3.component';

describe('NouvelleCampagne3Component', () => {
  let component: NouvelleCampagne3Component;
  let fixture: ComponentFixture<NouvelleCampagne3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvelleCampagne3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleCampagne3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
