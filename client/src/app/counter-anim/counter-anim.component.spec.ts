import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterAnimComponent } from './counter-anim.component';

describe('CounterAnimComponent', () => {
  let component: CounterAnimComponent;
  let fixture: ComponentFixture<CounterAnimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterAnimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterAnimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
