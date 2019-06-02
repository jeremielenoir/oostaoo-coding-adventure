import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectionDeDonneesComponent } from './protection-de-donnees.component';

describe('ProtectionDeDonneesComponent', () => {
  let component: ProtectionDeDonneesComponent;
  let fixture: ComponentFixture<ProtectionDeDonneesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtectionDeDonneesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectionDeDonneesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
