import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTypeComponent } from './multiple-type.component';

describe('MultipleTypeComponent', () => {
  let component: MultipleTypeComponent;
  let fixture: ComponentFixture<MultipleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
