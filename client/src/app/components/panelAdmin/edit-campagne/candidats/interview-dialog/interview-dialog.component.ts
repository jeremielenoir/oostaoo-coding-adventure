import { Component, OnInit, Inject } from '@angular/core';
import { ApiClientService, API_URI_INTERVIEWS, API_URI_USER } from 'src/app/api-client/api-client.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
//@ts-ignore 
import { default as _rollupMoment } from 'moment';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
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


  public interview: any;
  populateForm: FormGroup;
  submittedForm = false;
  public htmlContent: any;
  public subject: string;
  public Editor = ClassicEditor;
  public interview_link: string = "https://spwrtc.osc-fr1.scalingo.io/"
  public loading: Boolean = false;
  public currentDate: any = new Date()
  errors = null;
  results = null;
  public show: any = true;
  currentUser: any;
  public times: any = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InterviewDialogComponent>,
    public apiClientService: ApiClientService,
    private userToken: DecryptTokenService,
    private _adapter: DateAdapter<any>,
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

  onValueChanges(): void {
    this.populateForm.valueChanges.subscribe(val => {
      console.log("value changed", val);
    })
  }
  ngOnInit() {
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

      return result
    })



    if (this.userToken && this.userToken.userId) {
      this.apiClientService
        .get(API_URI_USER + '/' + this.userToken.userId)
        .subscribe(user => {
          this.currentUser = user;


        });
    };


    const date = this.pctrl && this.pctrl.interview_date && this.pctrl.interview_date.value && this.pctrl.time && this.pctrl.time.value ?

      ` à la date du ${moment(this.pctrl.interview_date.value).format('MM/DD/YYYY')}   ${this.pctrl.time.value}`
      : ''
    this.subject = `Entretien video conférence`

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
                new Date(this.interview.interview_date)
                // moment(this.interview.interview_date).format("yyyy-MM-ddThh:mm")
                , Validators.required],
              email: [this.interview.candidats[0].email, Validators.required],
              name: [this.interview.candidats[0].Nom, Validators.required],
              interview_link: [this.interview.interview_link, Validators.required],
              htmlContent: [this.interview.email_content, Validators.required],
              time: [moment(this.interview.interview_date).format("HH:mm"), Validators.required],

            });

          }

        }
        ).catch(e => console.log("error fetching interview", e))


    }
    else {


      this.htmlContent = `
      <div><span style="background-color: transparent; font-size: 1rem;">Bonjour ${this.data.Candidats},</span><br>
      </div><div><span style="background-color: transparent; font-size: 1rem;"><br></span></div>
      <div>Votre candidature a retenu notre attention suite aux résultats des tests techniques.</div><div>Dans le cadre de notre processus
      de recrutement,nous avons le plaisir de vous inviter à passer un entretien vidéo conférence 
     <<entretien_date>>
      </div>
     <div>
      <a href="${this.interview_link}" target="_blank" style="font-size: 1rem;">
     lien de la vidéoconférence</a></div>
      <div><br></div><div><br></div>
      <div>Bonne chance !</div><div>Cordialement </div>
   `;
      this.populateForm = this.formBuilder.group({
        interview_date: ['', Validators.required],
        time: ['', Validators.required],
        email: [this.data.Email, Validators.required],
        name: [this.data.Candidats, Validators.required],
        htmlContent: [this.htmlContent, Validators.required],
        interview_link: [this.interview_link, Validators.required]

      });

    }


    this.onValueChanges()
  }
  get interview_date() { return this.populateForm.get('interview_date'); }
  get time() { return this.populateForm.get('time'); }

  save() {
    const date = this.pctrl && this.pctrl.interview_date && this.pctrl.interview_date.value && this.pctrl.time && this.pctrl.time.value ?

      ` à la date du ${moment(this.pctrl.interview_date.value).format('DD/MM/YYYY')}   ${this.pctrl.time.value}`
      : ''
    const email_content = this.pctrl.htmlContent.value.toString().replace('<<entretien_date>>', date)
    if (this.data && this.data.Interview && this.data.Interview.id) {
      this.loading = true;
      const id = this.data.Interview.id
      const apiURL = API_URI_INTERVIEWS + "/" + id;

      let interview_date = moment(this.pctrl.interview_date.value);
      const [hour, minute] = this.pctrl.time.value.split(":");
      interview_date.set({
        hour,
        minute
      });


      const data: any = {
        id,
        interview_date,
        candidats: [{ id: this.data.candidat_id, email: this.pctrl.email.value }],
        user: { id: this.userToken.userId, email: this.currentUser.email },
        interview_link: this.interview_link,
        email_title: this.subject,
        email_content,

      }
      return this.apiClientService
        .put(apiURL, data)
        .toPromise()
        .then(() => {

          this.close()

        }
        ).catch(e => {

          this.loading = false;
          console.log("error updating interview", e)
        })
    } else {

      const apiURL = API_URI_INTERVIEWS;
      let interview_date = moment(this.pctrl.interview_date.value);
      const [hour, minute] = this.pctrl.time.value.split(":");
      interview_date.set({
        hour,
        minute
      })
      this.loading = true;
      const data: any = {
        interview_date,
        candidats: [{ id: this.data.candidat_id, email: this.pctrl.email.value }],
        user: { id: this.userToken.userId, email: this.currentUser.email },
        email_title: this.subject,
        email_content,
        interview_link: this.interview_link
      }
      return this.apiClientService
        .post(apiURL, data)
        .toPromise()
        .then(() => {
          this.close()

        }
        ).catch(e => {
          this.loading = false;
          console.log("error creating interview", e)
        })

    }

  }


  remove() {
    if (this.data && this.data.Interview && this.data.Interview.id) {
     
      const id = this.data.Interview.id


      const apiURL = API_URI_INTERVIEWS + "-cancel";
      if (window.confirm()) {
        this.loading = true;
        let interview_date = moment(this.pctrl.interview_date.value);
        const [hour, minute] = this.pctrl.time.value.split(":");
        interview_date.set({
          hour,
          minute
        });
        const date = this.pctrl && this.pctrl.interview_date && this.pctrl.interview_date.value && this.pctrl.time && this.pctrl.time.value ?

          ` à la date du ${moment(this.pctrl.interview_date.value).format('DD/MM/YYYY')}   ${this.pctrl.time.value}`
          : ''
        const email_content = `
        <div><span style="background-color: transparent; font-size: 1rem;">Bonjour ${this.data.Candidats},</span><br>
        </div><div><span style="background-color: transparent; font-size: 1rem;"><br></span></div>
        <div>Votre entretien vidéo , ${date}, a été annulé</div> 
       <div>
        
        <div><br></div><div><br></div>
        <div>Bonne chance !</div><div>Cordialement </div>
     `;
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
          .post(apiURL,data)
          .toPromise()
          .then(() => {
          this.loading = false
            this.close()

          }
          ).catch(e => {
            this.loading = false;
            console.log("error deleting interview", e)
          })
      }
    }


    return
  }

}