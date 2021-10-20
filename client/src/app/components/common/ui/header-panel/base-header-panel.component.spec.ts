import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseHeaderPanel } from './base-header-panel.component';

describe('BaseHeaderPanel', () => {
  let component: BaseHeaderPanel;
  let fixture: ComponentFixture<BaseHeaderPanel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseHeaderPanel]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseHeaderPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
