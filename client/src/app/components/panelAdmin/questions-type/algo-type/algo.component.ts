import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(public apiClientService: ApiClientService) {}

  testCode() {
    try {
      this.loading = true;
      const file = new File([this.question.content.toString()], this.filename, {
        type: this.filetype,
      });

      const formData: FormData = new FormData();
      formData.append('files', file, file.name);

      this.apiClientService
        .post(`${EXECUTE_SCRIPT}${this.question.id.toString()}`, formData)
        .toPromise()
        .then((data) => {
          if (data) {
            this.loading = false;
            this.responseTestCode = data.testCode;
            this.responseTestAnswer = data.testAnswer;
            this.responsesIsValid =
              this.responseTestCode &&
              this.responseTestCode.every((v) => v.resultValidation === true);
          }
        })
        .catch((error) => {
          console.log('error', error);
          this.loading = false;
          this.responseTestCode = error;
        });
    } catch (error) {
      throw error;
    }
  }
}
