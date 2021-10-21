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
export class AlgoComponent implements OnInit {
  @Input() question: any = { content: '', extension: '' };
  @Input() options: any = {};
  @Input() filename: any = {};
  @Input() filetype: any = {};
  public result: any = false;
  public loading: boolean = false;
  editorOptions = { theme: 'vs-dark', language: 'javascript' };

  constructor(public apiClientService: ApiClientService) {}
  ngOnInit(): void {

  }
  async testCode() {
    try {
      this.loading = true;
      const file = new File([this.question.content.toString()], this.filename, {
        type: this.filetype,
      });

      const formData: FormData = new FormData();
      formData.append('files', file, file.name);

      this.apiClientService
        .post(EXECUTE_SCRIPT, formData)
        .toPromise()
        .then((data) => {
          console.log('data', data);
          this.loading = false;
          this.result = data;
        })
        .catch((error) => {
          console.log('error', error);
          this.loading = false;
          this.result = error;
        });
    } catch (error) {
      throw error;
    }
  }
}
