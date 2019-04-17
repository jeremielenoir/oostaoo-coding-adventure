import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteComponentComponent } from './route-component.component';

describe('RouteComponentComponent', () => {
  let component: RouteComponentComponent;
  let fixture: ComponentFixture<RouteComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
