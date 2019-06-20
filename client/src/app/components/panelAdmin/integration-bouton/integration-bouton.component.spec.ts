import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationBoutonComponent } from './integration-bouton.component';

describe('IntegrationBoutonComponent', () => {
  let component: IntegrationBoutonComponent;
  let fixture: ComponentFixture<IntegrationBoutonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntegrationBoutonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationBoutonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
