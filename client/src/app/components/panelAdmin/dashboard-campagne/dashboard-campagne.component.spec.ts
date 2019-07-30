import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboadCampagneComponent } from './dashboard-campagne.component';

describe('DashboadCampagneComponent', () => {
  let component: DashboadCampagneComponent;
  let fixture: ComponentFixture<DashboadCampagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboadCampagneComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboadCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
