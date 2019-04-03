import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMaterialComponent } from './navbar-material.component';

describe('NavbarMaterialComponent', () => {
  let component: NavbarMaterialComponent;
  let fixture: ComponentFixture<NavbarMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
