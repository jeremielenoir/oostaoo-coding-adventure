import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ApiClientService,
  EXECUTE_SCRIPT,
} from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-algo',
  templateUrl: './algo.component.html',
  styleUrls: ['./algo.component.scss'],
})
export class AlgoComponent {
  @Input() question: any = { content: '', extension: '' };
  @Input() options: any = {};
  @Input() filename: any = {};
  @Input() filetype: any = {};
  responseTestCode: [any];
  responseTestAnswer: boolean;
  responseScriptResult: any;
  responsesIsValid: boolean;

  public loading: boolean = false;
  editorOptions = { theme: 'vs-dark', language: 'javascript' };

  constructor(private http: HttpClient) {}

  testCode(): Observable<Record<string, any>> {
    this.loading = true;
    const file = new File([this.question.content.toString()], this.filename, {
      type: this.filetype,
    });
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    return this.http
      .post<Record<string, any>>(
        `${EXECUTE_SCRIPT}${this.question.id.toString()}`,
        formData,
      )
      .pipe(
        tap((data) => {
          this.loading = false;
          this.responseTestCode = data.testCode;
          this.responseTestAnswer = data.testAnswer;
          this.responsesIsValid =
            this.responseTestCode &&
            this.responseTestCode.every((v) => v.resultValidation === true);
          return data.testAnswer;
        }),
        catchError((err) => {
          console.log('error', err);
          this.loading = false;
          this.responseTestCode = err;
          return EMPTY;
        }),
      );
  }
}
