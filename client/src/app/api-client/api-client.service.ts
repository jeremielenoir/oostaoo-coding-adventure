import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { DecryptTokenService } from '../components/home/register/register.service';

const prefix = '/api/';

export const TUTORIAL_ID = 5; // this campaign is for tutorial only
export const QUESTION_SEPARATOR = '&#x263C;';

export const API_URI_CAMPAIGNS: string = prefix + 'campaigns';
export const API_URI_CAMPAIGN: string = prefix + 'campaign/:id';
export const API_URI_TUTORIAL: string = API_URI_CAMPAIGNS + '/' + TUTORIAL_ID;
export const API_URI_TECHNO: string = prefix + 'technologies';
export const API_URI_PROFILES: string = prefix + 'profiles';
export const API_URI_QUESTIONS: string = prefix + 'questions';
export const API_URI_CANDIDATS: string = prefix + 'candidats';
export const API_URI_CANDIDATS_BY_TOKEN: string = API_URI_CANDIDATS + '/token';
export const API_URI_INTERVIEWS: string = prefix + 'interviews';
export const API_URI_CANDIDATS_PDF_REPORT: string = prefix + 'candidats-report-pdf/';
export const API_URI_EMAIL: string = prefix + 'email';
export const API_URI_USER_ADMIN: string = prefix + 'utilisateursadmins';
export const API_URI_ENTREPRISE: string = prefix + 'entreprises';
export const API_URI_USER_ENTREPRISE: string = prefix + 'utilsateurentreprises';
export const API_URI_USER = '/users';
export const API_URI_ACCOUNT = prefix + 'customeraccounts';
export const API_URI_ADDRESS = prefix + 'addresses';
export const API_URI_USERS_BY_ADMIN = prefix + 'usersByAdmin';
export const API_URI_NOTIFICATIONS: string = prefix + 'notifications';
export const API_URI_OFFER: string = prefix + 'offers';
export const API_URI_PAYMENT: string = prefix + 'payments';
export const API_URI_FEEDBACK: string = prefix + 'feedbacks';
export const API_URI_FAQ: string = prefix + 'faqs';
export const API_URI_ISSUE: string = prefix + 'issues';
export const API_URI_ROLE = '/users-permissions/roles';
export const EXECUTE_SCRIPT: string = prefix + 'questions/execute/';
export const API_POPULATE_QUESTIONS_SPREADSHEET: string = prefix + 'questions/populate/';

export const UPLOAD_TO_STRAPI = '/upload';

// Bp6PnJmoydK5rz6o

@Injectable()
export class ApiClientService {
  public _user = new BehaviorSubject(null);
  constructor(private http: HttpClient, public decryptTokenService: DecryptTokenService) {
    this.getUser();
    // console.log('this._user : ', this._user);
  }

  private handleError(error: any, caught: Observable<any>): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = error;
    }
    return throwError(errorMessage);
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getUser() {
    if (this.decryptTokenService.userId) {
      this.get(API_URI_USER + '/' + this.decryptTokenService.userId).subscribe(data => {
        if (data) {
          this._user.next(data);
        }
      });
    }
  }

  /**
   * Methode get()
   * @param path
   */
  get(path: string): Observable<any> {
    return this.http.get(path).pipe(map(this.extractData));
  }

  /**
   * Methode post()
   * @param path
   * @param payload
   */
  post(path: string, payload: any): Observable<any> {
    return this.http.post<any>(path, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Methode delete()
   * @param path
   */
  delete(path: string): Observable<any> {
    return this.http.delete<any>(path).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Methode put()
   * @param path
   * @param payload
   */
  put(path: string, payload: any): Observable<any> {
    return this.http.put<any>(path, payload).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * Methode put()
   * @param path
   * @param payload
   */
  patch(path: string, payload: any): Observable<any> {
    return this.http.patch<any>(path, payload).pipe(
      catchError(this.handleError)
    );
  }

}
