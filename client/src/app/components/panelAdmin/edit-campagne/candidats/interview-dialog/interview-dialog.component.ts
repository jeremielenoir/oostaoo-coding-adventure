import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput, MatSelect } from '@angular/material';
import { Validators, FormGroup, FormBuilder, } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
//@ts-ignore 
import { default as _rollupMoment } from 'moment';
import { ApiClientService, API_URI_INTERVIEWS, API_URI_USER } from 'src/app/api-client/api-client.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';


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
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class InterviewDialogComponent implements OnInit {
  public currentDate: any = new Date()
  public Editor = ClassicEditor;
  public htmlContent: any;
  public interview: any;
  public interview_link: string = "https://interview.oostaoo.com/rooms/"
  public loading: Boolean = false;
  public show: any = true;
  public status: string;
  public STATUS_CREATE = "CREATE";
  public STATUS_VIEW = "VIEW";
  public STATUS_UPDATE = "UPDATE";
  public subject: string;
  public times: any = [];
  currentUser: any;
  HTML_CONTENT_CREATE = `
        <div>
          <span style="background-color: transparent; font-size: 1rem;">Bonjour${this.formatCandidatName(this.data.Candidats)},</span>
          <br />
          <br />
        </div>
        <div>
          Votre candidature a retenu notre attention suite aux résultats des tests techniques.
        </div>
        <div>
          Dans le cadre de notre processus de recrutement, nous avons le plaisir de vous inviter à passer un entretien vidéo conférence [date de l'entretien].
        </div>
        <div>
          <a href="${this.interview_link}"  target="_blank" style="font-size: 1rem;">lien de la vidéoconférence</a>
          <br />
          <br />
        </div>
        <div>
          Bonne chance !
          <br />
          Cordialement
        </div>
      `;
  HTML_CONTENT_UPDATE = `
            <div>
              <span style="background-color: transparent; font-size: 1rem;">Bonjour${this.formatCandidatName(this.data.Candidats)},</span>
              <br />
              <br />
            </div>
            <div>
              Votre entretien vidéo du [date] a été déplacé [nouvelle date].
              <br />
              <br />
            </div>
            <div>
              Cordialement
            </div>
        `;
  HTML_CONTENT_CANCEL = `
            <div>
              <span style="background-color: transparent; font-size: 1rem;">Bonjour${this.formatCandidatName(this.data.Candidats)},</span>
              <br />
              <br />
            </div>
            <div>
              Votre entretien vidéo, [date], a été annulé.
              <br />
              <br />
            </div>
            <div>
              Cordialement
            </div>
        `;
  errors = null;
  populateForm: FormGroup;
  results = null;
  submittedForm = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _adapter: DateAdapter<any>,
    private formBuilder: FormBuilder,
    private userToken: DecryptTokenService,
    public apiClientService: ApiClientService,
    public dialogRef: MatDialogRef<InterviewDialogComponent>,
    public languageService: SelectedLanguageService
  ) {
    const lang = this.languageService.getLanguageCountry();

    switch (lang) {
      case 'es-ES': this._adapter.setLocale('es'); break;
      case 'fr-FR': this._adapter.setLocale('fr'); break;
      case 'en-US': this._adapter.setLocale('en'); break;
      case 'jp-JP': this._adapter.setLocale('ja-JP'); break;
      default: this._adapter.setLocale('fr'); break;
    };
  }

  close() {
    this.dialogRef.close()
  }

  get pctrl() {
    if (!this.populateForm || !this.populateForm.controls) {
      return null
    }
    return this.populateForm.controls;
  }

  get interview_date() { return this.populateForm.get('interview_date'); }

  get time() { return this.populateForm.get('time'); }

  get formInterviewDate() {
    return this.pctrl && this.pctrl.interview_date && this.pctrl.interview_date.value && this.pctrl.time && this.pctrl.time.value ? ` à la date du ${moment(this.pctrl.interview_date.value).format('DD/MM/YYYY')} à ${this.pctrl.time.value}` : ''
  }

  formatCandidatName(name) {
    return name === "-" ? "" : " " + name;
  }

  setStatus(status) {
    this.status = status;
    if (status === this.STATUS_UPDATE) {
      this.pctrl['interview_date'].reset('');
      this.pctrl['time'].reset();
    } else {
      this.pctrl['interview_date'].reset(this.interview.interview_date);
      this.pctrl['time'].reset(moment(this.interview.interview_date).format("HH:mm"));
    }
  }

  /* onValueChanges(): void {
     this.populateForm.valueChanges.subscribe(val => {
       console.log("value changed", val);
     })
   } */

  ngOnInit() {
    // Get current user infos
    if (this.userToken && this.userToken.userId) {
      this.apiClientService
        .get(API_URI_USER + '/' + this.userToken.userId)
        .subscribe(user => {
          this.currentUser = user;
        });
    };

    // Compute times for Select hour
    for (let hour = 0; hour < 24; hour++) {
      this.times.push(moment({ hour }).format('HH:mm'));
      this.times.push(
        moment({
          hour,
          minute: 30
        }).format('HH:mm')
      );
    }
    this.times = this.times.sort((a, b) => {
      moment(new Date(a)).isBefore(moment(new Date(b)));
      const currentDate = new Date()
      const [hourA, mmA] = a.split(":")
      let firstDate = moment(currentDate).set({
        hour: hourA,
        minute: mmA
      })
      const [hourB, mmB] = b.split(":")
      let secondDate = moment(currentDate).set({
        hour: hourB,
        minute: mmB
      });
      const result = firstDate.diff(secondDate);
      return result;
    })

    // Set form datas
    this.subject = `Entretien video conférence`;
    this.status = this.data && this.data.Interview && this.data.Interview.id ? this.STATUS_VIEW : this.STATUS_CREATE;

    if (this.status === this.STATUS_CREATE) {
      this.htmlContent = this.HTML_CONTENT_CREATE;
      this.populateForm = this.formBuilder.group({
        interview_date: ['', Validators.required],
        time: ['', Validators.required],
        email: [this.data.Email, Validators.required],
        name: [this.data.Candidats, Validators.required],
        htmlContent: [this.htmlContent, Validators.required],
        interview_link: [this.interview_link, Validators.required]
      });

    } else if (this.status === this.STATUS_VIEW) {
      this.htmlContent = this.HTML_CONTENT_UPDATE;
      const apiURL = API_URI_INTERVIEWS + "/" + this.data.Interview.id;
      this.apiClientService
        .get(apiURL)
        .toPromise()
        .then((res) => {
          if (res) {
            this.interview = res;
            //  this.interview_link = res.interview_link;
            this.populateForm = this.formBuilder.group({
              interview_date: [
                new Date(this.interview.interview_date)
                // moment(this.interview.interview_date).format("yyyy-MM-ddThh:mm")
                , Validators.required],
              email: [this.interview.candidats[0].email, Validators.required],
              name: [this.interview.candidats[0].Nom, Validators.required],
              interview_link: [this.interview.interview_link, Validators.required],
              htmlContent: [this.htmlContent.replace("[date]", moment(this.interview.interview_date).format('DD/MM/YYYY')), Validators.required],
              time: [moment(this.interview.interview_date).format("HH:mm"), Validators.required],
            });
          }
        })
        .catch(e => {
          console.log("Error fetching interview", e)
          throw new Error(`Error fetching interview :\n${e}`);
        })
    }

    /* this.onValueChanges() */
  }



  save() {
    const date = this.formInterviewDate;

    if (this.status === this.STATUS_UPDATE) {
      this.loading = true;
      const id = this.data.Interview.id;
      const apiURL = API_URI_INTERVIEWS + "/" + id;

      let interview_date = moment(this.pctrl.interview_date.value);
      const [hour, minute] = this.pctrl.time.value.split(":");
      interview_date.set({
        hour,
        minute
      });

      const email_content = this.pctrl.htmlContent.value.toString().replace("[nouvelle date]", date);
      const data: any = {
        id,
        interview_date,
        candidats: [{ id: this.data.candidat_id, email: this.pctrl.email.value, name: this.pctrl.name.value }],
        user: { ...this.currentUser, id: this.userToken.userId },
        interview_link: this.interview_link,
        email_title: this.subject,
        email_content,
      }

      return this.apiClientService
        .put(apiURL, data)
        .toPromise()
        .then(() => {
          this.close();
        }
        ).catch(e => {
          this.loading = false;
          throw new Error(`Error updating interview :\n${e}`);
        })
    } else if (this.status === this.STATUS_CREATE) {
      const apiURL = API_URI_INTERVIEWS;

      let interview_date = moment(this.pctrl.interview_date.value);
      const [hour, minute] = this.pctrl.time.value.split(":");
      interview_date.set({
        hour,
        minute
      })

      const email_content = this.pctrl.htmlContent.value.toString().replace("[date de l'entretien]", date)
      this.loading = true;
      const data: any = {
        interview_date,
        candidats: [{ id: this.data.candidat_id, email: this.pctrl.email.value, name: this.pctrl.name.value }],
        user: { ...this.currentUser, id: this.userToken.userId },
        email_title: this.subject,
        email_content,
        interview_link: this.interview_link
      }

      return this.apiClientService
        .post(apiURL, data)
        .toPromise()
        .then(() => {
          this.close();
        }
        ).catch(e => {
          this.loading = false;
          throw new Error(`Error creating interview :\n${e}`);
        })
    }
  }

  remove() {
    if (!(this.data && this.data.Interview && this.data.Interview.id)) {
      return
    }

    const id = this.data.Interview.id;
    const apiURL = API_URI_INTERVIEWS + "-cancel";

    if (window.confirm("Voulez-vous annuler cet entretien ? ( le candidat sera prévenu automatiquement par email )")) {
      this.loading = true;
      let interview_date = moment(this.pctrl.interview_date.value);
      const [hour, minute] = this.pctrl.time.value.split(":");
      interview_date.set({
        hour,
        minute
      });

      const date = this.formInterviewDate;
      const email_content = this.HTML_CONTENT_CANCEL.replace("[date]", date);
      const data: any = {
        id,
        interview_date,
        candidats: [{ id: this.data.candidat_id, email: this.pctrl.email.value }],
        user: { id: this.userToken.userId, email: this.currentUser.email },
        interview_link: this.interview_link,
        email_title: `Annulation Entretien vidéo du ${date}`,
        email_content,
      }

      return this.apiClientService
        .post(apiURL, data)
        .toPromise()
        .then(() => {
          this.loading = false;
          this.close();
        }
        ).catch(e => {
          this.loading = false;
          throw new Error(`Error deleting interview :\n${e}`);
        })
    }
  }
}
