import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondSectionComponent } from './second-section.component';

describe('SecondSectionComponent', () => {
  let component: SecondSectionComponent;
  let fixture: ComponentFixture<SecondSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
