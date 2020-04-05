import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOffersComponent } from './home-offers.component';

describe('OffersComponent', () => {
  let component: HomeOffersComponent;
  let fixture: ComponentFixture<HomeOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
