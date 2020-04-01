import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactJoinUsComponent } from './contact-join-us.component';

describe('ContactJoinUsComponent', () => {
  let component: ContactJoinUsComponent;
  let fixture: ComponentFixture<ContactJoinUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactJoinUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactJoinUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
