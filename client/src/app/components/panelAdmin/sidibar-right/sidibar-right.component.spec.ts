import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidibarRightComponent } from './sidibar-right.component';

describe('SidibarRightComponent', () => {
  let component: SidibarRightComponent;
  let fixture: ComponentFixture<SidibarRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidibarRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidibarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
