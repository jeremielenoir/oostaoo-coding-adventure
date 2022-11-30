import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CodeLanguages } from 'src/app/models/code-languages.model';

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  constructor(private http: HttpClient) {}

  public getJSON(jsonPath: string): Observable<CodeLanguages[]> {
    return this.http.get(jsonPath).pipe(map((result: any) => result));
  }
}
