import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCampagneComponent } from './edit-campagne.component';

describe('EditCampagneComponent', () => {
  let component: EditCampagneComponent;
  let fixture: ComponentFixture<EditCampagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCampagneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
