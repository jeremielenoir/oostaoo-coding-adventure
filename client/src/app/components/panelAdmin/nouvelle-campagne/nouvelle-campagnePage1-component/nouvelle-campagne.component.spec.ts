import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCampagnePage1Component } from './nouvelle-campagne.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MaterialModule } from 'src/app/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiClientService } from '../../../../api-client/api-client.service';


fdescribe('NouvelleCampagneComponent', () => { // f for select only this TEST
  let component: NouvelleCampagnePage1Component;
  let fixture: ComponentFixture<NouvelleCampagnePage1Component>;
  const formBuilder: FormBuilder = new FormBuilder();
  // const profiles = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule, HttpClientModule, BrowserAnimationsModule],
      declarations: [NouvelleCampagnePage1Component],
      providers: [
        ApiClientService,
        { provide: FormBuilder, useValue: formBuilder }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleCampagnePage1Component);
    component = fixture.componentInstance;
    component.formCampagne = formBuilder.group({
      role: null,
      techno: null,
      experience: null,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('get techno when user select techno', () => {
    let technosSelected = null;
    component.valueChange.subscribe(techno => technosSelected = techno);
    component.valueChanged();
    expect(technosSelected).not.toBeNull();
  });
  // it('test myfunction somme', () => {
  //   const monResultat = 2;
  //   expect(component.somme(1, 1)).toEqual(monResultat);
  // });
  it('get profiles not null from server', () => {
    expect(component.getProfiles()).not.toBeNull(); // not.tobeNull(); toequalNull();
  });
});
