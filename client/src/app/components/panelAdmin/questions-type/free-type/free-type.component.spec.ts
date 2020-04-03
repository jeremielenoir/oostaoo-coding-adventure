import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTypeComponent } from './free-type.component';

describe('FreeTypeComponent', () => {
  let component: FreeTypeComponent;
  let fixture: ComponentFixture<FreeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
