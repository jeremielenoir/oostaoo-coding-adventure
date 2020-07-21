import { Component, OnInit, Inject } from '@angular/core';
import { ApiClientService, API_URI_INTERVIEWS, API_URI_USER } from 'src/app/api-client/api-client.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as moment from "moment"
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
@Component({
  selector: 'app-interview-dialog',
  templateUrl: './interview-dialog.component.html',
  styleUrls: ['./interview-dialog.component.scss']
})
export class InterviewDialogComponent implements OnInit {


  public interview: any;
  populateForm: FormGroup;
  submittedForm = false;
  public htmlContent: any;
  public subject: string;
  public Editor = ClassicEditor;
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
    if (this.userToken && this.userToken.userId) {
      this.apiClientService
        .get(API_URI_USER + '/' + this.userToken.userId)
        .subscribe(user => {
          this.currentUser = user;
          console.log("user", user)

        });
    }
    this.subject = `Entretien video conférence`
    this.htmlContent = `
    <div><span style="background-color: transparent; font-size: 1rem;">Bonjour ${this.data.Candidats},</span><br>
    </div><div><span style="background-color: transparent; font-size: 1rem;"><br></span></div>
    <div>Votre candidature a retenu notre attention suitre aux résultats des tests techniques.</div><div>Dans le cadre de notre processus
    de recrutement,nous avons le plaisir de vous inviter à passer un entretien vidéo conférence</div>
   <div>
    <a href="http://${window.location.host}/evaluate/..." target="_blank" style="font-size: 1rem;">
    http://${window.location.host}/evaluate/...</a></div>
    <div><br></div><div><br></div>
    <div>Bonne chance !</div><div>Cordialement </div>
 `;
    if (this.data && this.data.interview && this.data.interview.id) {
      const apiURL = API_URI_INTERVIEWS + "/" + this.data.interview.id;
      return this.apiClientService
        .get(apiURL)
        .toPromise()
        .then((res) => {
          if (res) {
            this.interview = res;
            this.populateForm = this.formBuilder.group({
              interview_date: [this.interview.interview_date, Validators.required],
              email: [this.interview.candidats[0].email, Validators.required],
              name: [this.interview.candidats[0].Nom, Validators.required],

            });
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

      });

    }
  }


  save() {
    if (this.data && this.data.interview && this.data.interview.id) {
      const id = this.data.interview.id
      const apiURL = API_URI_INTERVIEWS + "/" + id;

      const data: any = {
        id,
        interview_date: this.pctrl.interview_date.value,
        candidats: [{ id: this.data.candidat_id }],
        user: { id: this.userToken.userId, email: this.currentUser.email },
        /*  email_title: this.subject,
         email_content: this.htmlContent, */

      }
      return this.apiClientService
        .put(apiURL, data)
        .toPromise()
        .then((res) => {
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
      }
      return this.apiClientService
        .post(apiURL, data)
        .toPromise()
        .then((res) => {
          this.close()

        }
        ).catch(e => console.log("error creating interview", e))

    }

  }

}
