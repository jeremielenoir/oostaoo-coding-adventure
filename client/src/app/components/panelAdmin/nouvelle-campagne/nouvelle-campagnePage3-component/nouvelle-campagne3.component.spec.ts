import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCampagnePage3Component } from './nouvelle-campagne3.component';

describe('NouvelleCampagne3Component', () => {
  let component: NouvelleCampagnePage3Component;
  let fixture: ComponentFixture<NouvelleCampagnePage3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NouvelleCampagnePage3Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleCampagnePage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
