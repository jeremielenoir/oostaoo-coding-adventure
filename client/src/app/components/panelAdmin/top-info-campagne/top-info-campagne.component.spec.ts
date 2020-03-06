import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopInfoCampagneComponent } from './top-info-campagne.component';

describe('TopInfoCampagneComponent', () => {
  let component: TopInfoCampagneComponent;
  let fixture: ComponentFixture<TopInfoCampagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopInfoCampagneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopInfoCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
