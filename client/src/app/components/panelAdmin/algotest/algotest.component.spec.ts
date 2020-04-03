import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgotestComponent } from './algotest.component';

describe('AlgotestComponent', () => {
  let component: AlgotestComponent;
  let fixture: ComponentFixture<AlgotestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgotestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgotestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
