import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export default class ErrorConfig {
    static handleError<T>(result = {} as T) {
        return (error: HttpErrorResponse): Observable<T> => {
          console.error(error);
          return of(result);
        };
      }
}
