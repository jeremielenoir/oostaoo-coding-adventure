import { Component, OnInit, Inject } from '@angular/core';
import { ApiClientService, API_URI_INTERVIEWS, API_URI_USER } from 'src/app/api-client/api-client.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
//@ts-ignore 
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-interview-dialog',
  templateUrl: './interview-dialog.component.html',
  styleUrls: ['./interview-dialog.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class InterviewDialogComponent implements OnInit {


  public interview: any;
  populateForm: FormGroup;
  submittedForm = false;
  public htmlContent: any;
  public subject: string;
  public Editor = ClassicEditor;
  public interview_link: string = "https://spwrtc.osc-fr1.scalingo.io/"
  public currentDate: any = new Date().toISOString()
  errors = null;
  results = null;
  public show: any = true;
  currentUser: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InterviewDialogComponent>,
    public apiClientService: ApiClientService,
    private userToken: DecryptTokenService,
  ) { }



  close() {
    this.dialogRef.close()
  }

  get pctrl() {
    return this.populateForm.controls;
  }

  ngOnInit() {
    console.log("interview data", this.data)
    if (this.userToken && this.userToken.userId) {
      this.apiClientService
        .get(API_URI_USER + '/' + this.userToken.userId)
        .subscribe(user => {
          this.currentUser = user;


        });
    }
    this.subject = `Entretien video conférence`
    this.htmlContent = `
    <div><span style="background-color: transparent; font-size: 1rem;">Bonjour ${this.data.Candidats},</span><br>
    </div><div><span style="background-color: transparent; font-size: 1rem;"><br></span></div>
    <div>Votre candidature a retenu notre attention suite aux résultats des tests techniques.</div><div>Dans le cadre de notre processus
    de recrutement,nous avons le plaisir de vous inviter à passer un entretien vidéo conférence</div>
   <div>
    <a href="${this.interview_link}" target="_blank" style="font-size: 1rem;">
   ${this.interview_link}</a></div>
    <div><br></div><div><br></div>
    <div>Bonne chance !</div><div>Cordialement </div>
 `;
    if (this.data && this.data.Interview && this.data.Interview.id) {
      const apiURL = API_URI_INTERVIEWS + "/" + this.data.Interview.id;

      return this.apiClientService
        .get(apiURL)
        .toPromise()
        .then((res) => {

          if (res) {
            this.interview = res;
            this.interview_link = res.interview_link;
            //res.interview_date
            this.populateForm = this.formBuilder.group({
              interview_date: [
                //     moment(new Date(this.interview.interview_date)).format("YYYY/MM/DD HH:mm:ss")
                // moment(new Date(this.interview.interview_date)),
                moment(this.interview.interview_date)
                , Validators.required],
              email: [this.interview.candidats[0].email, Validators.required],
              name: [this.interview.candidats[0].Nom, Validators.required],
              interview_link: [this.interview.interview_link, Validators.required],
              htmlContent: [this.interview.email_content, Validators.required],

            });
            console.log("his.populateForm ", this.populateForm)
          }

        }
        ).catch(e => console.log("error fetching interview", e))


    }
    else {
      this.populateForm = this.formBuilder.group({
        interview_date: ['', Validators.required],
        email: [this.data.Email, Validators.required],
        name: [this.data.Candidats, Validators.required],
        htmlContent: [this.htmlContent, Validators.required],
        interview_link: [this.interview_link, Validators.required]

      });

    }
  }


  save() {
    if (this.data && this.data.Interview && this.data.Interview.id) {
      const id = this.data.Interview.id
      const apiURL = API_URI_INTERVIEWS + "/" + id;

      const data: any = {
        id,
        interview_date: this.pctrl.interview_date.value,
        candidats: [{ id: this.data.candidat_id }],
        user: { id: this.userToken.userId, email: this.currentUser.email },
        interview_link: this.interview_link,
        email_title: this.subject,
        email_content: this.pctrl.htmlContent.value,

      }
      return this.apiClientService
        .put(apiURL, data)
        .toPromise()
        .then(() => {
          this.close()

        }
        ).catch(e => console.log("error updating interview", e))
    } else {

      const apiURL = API_URI_INTERVIEWS;

      const data: any = {
        interview_date: this.pctrl.interview_date.value,
        candidats: [{ id: this.data.candidat_id, email: this.data.Email }],
        user: { id: this.userToken.userId, email: this.currentUser.email },
        email_title: this.subject,
        email_content: this.htmlContent,
        interview_link: this.interview_link
      }
      return this.apiClientService
        .post(apiURL, data)
        .toPromise()
        .then(() => {
          this.close()

        }
        ).catch(e => console.log("error creating interview", e))

    }

  }

}
