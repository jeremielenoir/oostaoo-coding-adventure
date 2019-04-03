import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestanimComponent } from './testanim.component';

describe('TestanimComponent', () => {
  let component: TestanimComponent;
  let fixture: ComponentFixture<TestanimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestanimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestanimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
