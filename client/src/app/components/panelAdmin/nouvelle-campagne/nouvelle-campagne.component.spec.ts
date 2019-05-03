import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCampagneComponent } from './nouvelle-campagne.component';

describe('NouvelleCampagneComponent', () => {
  let component: NouvelleCampagneComponent;
  let fixture: ComponentFixture<NouvelleCampagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvelleCampagneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
