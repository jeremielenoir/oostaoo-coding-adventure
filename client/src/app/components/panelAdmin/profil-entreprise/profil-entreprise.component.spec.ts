import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilEntrepriseComponent } from './profil-entreprise.component';

describe('ProfilEntrepriseComponent', () => {
  let component: ProfilEntrepriseComponent;
  let fixture: ComponentFixture<ProfilEntrepriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilEntrepriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
