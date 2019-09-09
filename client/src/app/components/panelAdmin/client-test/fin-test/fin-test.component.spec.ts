import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinTestComponent } from './fin-test.component';

describe('FinTestComponent', () => {
  let component: FinTestComponent;
  let fixture: ComponentFixture<FinTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
