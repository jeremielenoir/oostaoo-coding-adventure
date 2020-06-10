import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { API_POPULATE_QUESTIONS_SPREADSHEET } from "../../api-client/api-client.service";

@Component({
  selector: "app-questions",
  templateUrl: "./questions.component.html",
  styleUrls: ["./questions.component.scss"],
})
export class QuestionsComponent implements OnInit {
  populateForm: FormGroup;
  submittedPopulate = false;
  errors = null;
  results = null
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.populateForm = this.formBuilder.group({
      spreadsheetId: ["", Validators.required],
      page: ["", Validators.required],
      first: ["", Validators.required],
      last: ["", Validators.required],
    });
  }

  get pctrl() {
    return this.populateForm.controls;
  }

  onSubmit() {
    this.submittedPopulate = true;
    const spreadsheetId = this.pctrl.spreadsheetId.value;
    const page = this.pctrl.page.value;
    const first = this.pctrl.first.value;
    const last = this.pctrl.last.value;
    const query = `${API_POPULATE_QUESTIONS_SPREADSHEET}?spreadsheetId=${spreadsheetId}&page=${page}&first=${first}&last=${last}`;
    this.http
      .get(query)
      .toPromise()
      .then((results ) => {
        console.log("results",results)
        this.errors = null;
        this.results = results
        this.submittedPopulate = false;
        this.populateForm.reset();
         
      })
      .catch((err) => {
        this.results = null
        this.errors = err.message || err;
        this.submittedPopulate = false;
      });
  }
}
