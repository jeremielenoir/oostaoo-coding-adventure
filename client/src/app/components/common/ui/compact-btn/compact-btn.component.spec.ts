import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactBtnComponent } from './compact-btn.component';

describe('CompactBtnComponent', () => {
  let component: CompactBtnComponent;
  let fixture: ComponentFixture<CompactBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
