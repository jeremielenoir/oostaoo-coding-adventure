import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideMarquesComponent } from './slide-marques.component';

describe('SlideMarquesComponent', () => {
  let component: SlideMarquesComponent;
  let fixture: ComponentFixture<SlideMarquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlideMarquesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideMarquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
