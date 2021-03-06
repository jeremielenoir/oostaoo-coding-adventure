import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CandidatsMailComponent } from '../candidats-mail/candidats-mail.component';
import { DecryptTokenService } from "../../../home/register/register.service";
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS,
  API_URI_USER
} from '../../../../api-client/api-client.service';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-candidats-form',
  templateUrl: './candidats-form.component.html',
  styleUrls: ['./candidats-form.component.scss']
})
export class CandidatsFormComponent implements OnInit {
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

  @Input() globalId: string;
  @Input() status: string = "form";
  @Input() tests_available: number;
  @Output() onUpdateTestsAvailableWIP = new EventEmitter<any>();
  public form: FormGroup;
  public contactList: FormArray;
  public campaigns: any;
  candidatId: any;
  private decryptTokenService = new DecryptTokenService();


  public Editor = ClassicEditor;

  public candidats: any;

  public sujet: string;
  public namePlaceholder: string = "[nom du candidat]";
  public contenu: string;
  public editing = false;
  public htmlContent: any;

  public offer_id: any;
  public user_id: any;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router,
    public apiClientService: ApiClientService,
    public dialogRef: MatDialogRef<CandidatsMailComponent>,) {
    this.onUpdateTestsAvailableWIP = new EventEmitter();
  }
  // returns all form groups under contacts
  get contactFormGroup() {
    return this.form.get('contacts') as FormArray;
  }

  ngOnInit() {
    this.form = this.fb.group({
      contacts: this.fb.array([this.createContact()])
    });
    this.contactList = this.form.get('contacts') as FormArray;

    this.user_id = this.decryptTokenService.userId;
    this.offer_id = this.decryptTokenService.offer_id;

    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .subscribe(datas => {
        this.campaigns = [datas];
      });

    this.sujet = 'Évaluation technique';

    this.htmlContent = `<div><span style="background-color: transparent; font-size: 1rem;">Bonjour ${this.namePlaceholder},</span>
       </div><br /><br />
       <div>Votre candidature a retenu notre attention.</div><div>Dans le cadre de notre processus
       de recrutement, nous avons le plaisir de vous inviter à passer une évaluation technique.</div>
       <div>Vous pourrez choisir le moment le plus approprié pour vous pour passer ce test.</div>
       <div>Quand vous serez prêt(e), cliquez sur le lien ci-dessous pour accéder à la page d’accueil de votre session :&nbsp;
       <a href="http://${window.location.host}/evaluate/..." target="_blank" style="font-size: 1rem;">
       http://${window.location.host}/evaluate/...</a></div>
       <div><br></div><div><br></div>
       <div>Bonne chance !</div><div>Cordialement </div>
    `;
  }

  postCandidat(name, emailContact): Promise<any> {
    this.switchTo('loading');
    return this.apiClientService.post(API_URI_CANDIDATS, {
      name,
      email: emailContact,
      campaignId: this.globalId,
      emailTitle: this.sujet,
      emailContent: this.htmlContent,
      namePlaceholder: this.namePlaceholder
    }).toPromise()
      .then(res => {
        console.log('res', res.id);
        const idCandidat = [];
        idCandidat.push(res.id);
        this.openSnackBar("Un mail d'invitation a correctement été envoyé", "Fermer");
        return idCandidat;
      }).then(idCandidat => {
        this.updateCampaign(idCandidat);
      }).catch(err => {
        this.openSnackBar("Une erreur est survenue", "Fermer");
        console.log('log error', err);
      });
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['mat-snack-bar-container']
    });
  }

  goToSubscribe() {
    this.dialog.closeAll();
    this.router.navigate(['/subscription']);
  }

  updateCampaignPostCandidats() {
    let nbCandidats = this.candidats.length;
    if (this.tests_available == -1) {
      for (const iterator of this.candidats) {
        this.postCandidat(iterator.name, iterator.value);
      }
    } else if (this.offer_id == 14) {
      this.goToSubscribe();
    } else if (this.tests_available == 0) {
      setTimeout(() => {
        this.goToSubscribe();
      }, 1500)
      this.openSnackBar(`Vous n'avez plus de test disponible`, "Fermer");
    } else if (nbCandidats > this.tests_available) {
      // Note : this case should never happens has we have limited the number of candidats added to the number of tests_available
      setTimeout(() => {
        this.retourCandidat();
      }, 1500);
      this.openSnackBar(`Impossible d'inviter ${nbCandidats} candidat${nbCandidats > 1 ? 's' : ''}. Il vous reste seulement ${this.tests_available} test${this.tests_available > 1 ? 's' : ''} disponible${this.tests_available > 1 ? 's' : ''}`, "Fermer");
    } else {
      this.tests_available = this.tests_available - nbCandidats;
      this.apiClientService
        .put(`${API_URI_USER}/${this.user_id}`, {
          tests_available: this.tests_available
        })
        .toPromise()
        .then(async (res) => {
          localStorage.setItem('currentUser', res.newToken);
          for (const iterator of this.candidats) {
            this.postCandidat(iterator.name, iterator.value);
          }
        }).catch(
          err => console.log(err)
        );
    }
  }

  updateCampaign(idCandidat): Promise<any> {
    return this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.globalId, {
      candidats: idCandidat,
      email_title: this.sujet,
      email_content: this.htmlContent
    }).toPromise()
      .then((res) => {
        console.log('CANDIDATS', res);
        this.dialogRef.close(this.tests_available);
      }).catch(
        err => console.log(err)
      );
  }

  retourCandidat() {
    this.dialogRef.close(this.tests_available);
  }

  showCandidats() {
    console.log(this.candidats);
  }

  // contact formgroup
  createContact(): FormGroup {
    return this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      value: [null, Validators.compose([
        Validators.required,
        Validators.pattern(this.emailRegex)])]
    });
  }
  // add a contact form group
  addContact() {
    if (this.contactList.length < this.tests_available) {
      this.contactList.push(this.createContact());
    } else {
      this.openSnackBar("Limite de test disponibles atteinte", "Fermer");
    }
  }
  // remove contact from group
  removeContact(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.contactList.removeAt(index);
  }
  // get the formgroup under contacts form array
  getContactsFormGroup(index): FormGroup {
    // this.contactList = this.form.get('contacts') as FormArray;
    const formGroup = this.contactList.controls[index] as FormGroup;
    return formGroup;
  }

  validate(): boolean {
    // TODO : try to refacto with angular getError function ?
    return !this.form.controls["contacts"]["controls"].map(control => {
      return control.controls.name.errors === null && control.controls.value.errors === null;
    }).includes(false);
  }

  submit() {
    console.log('CandidatsFormComponent submit() > this.form.value.contacts: ', this.form.value.contacts);
  }

  switchTo(status) {
    this.candidats = this.form.value.contacts;
    this.status = status;
    /*this.dialog.open(CandidatsMailComponent, {
      data: {
        globalId: this.globalId,
        contact: this.form.value.contacts,
      },
      height: '580px'
    });*/
  }
}
