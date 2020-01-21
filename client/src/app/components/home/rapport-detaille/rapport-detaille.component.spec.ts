import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDetailleComponent } from './rapport-detaille.component';

describe('RapportDetailleComponent', () => {
  let component: RapportDetailleComponent;
  let fixture: ComponentFixture<RapportDetailleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDetailleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDetailleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
