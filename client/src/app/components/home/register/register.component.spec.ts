// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { RegisterComponent } from './register.component';

// fdescribe('RegisterComponent', () => {
//   let component: RegisterComponent;
//   let fixture: ComponentFixture<RegisterComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ RegisterComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RegisterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


// TEST //

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {  ApiClientService, API_URI_USER} from 'src/app/api-client/api-client.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {RegisterComponent} from './register.component';
import {DataService} from './regiss.components';
import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { tokenName } from '@angular/compiler';
import { tokenKey } from '@angular/core/src/view';


describe(`AuthHttpInterceptor`, () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        DataService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RegisterComponent,
          multi: true,
        },
        ApiClientService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RegisterComponent,
          multi: true,
        },
      ],
    });

    service = TestBed.get(DataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should add an Authorization header', () => {
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
      console.log('reponse', response);
    });



    const httpRequest = httpMock.expectOne(`${service.ROOT_URL}`);

    expect(httpRequest.request.headers.get('Authorization')).toBe('mytoken');

  });
});


