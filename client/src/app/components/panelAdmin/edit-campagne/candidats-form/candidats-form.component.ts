import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource, MatSort, MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CandidatsMailComponent } from '../candidats-mail/candidats-mail.component';
import { DecryptTokenService } from "../../../home/register/register.service";
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS,
  API_URI_USER
} from '../../../../api-client/api-client.service';
import { TotalTestsAvailableService } from '../services/total-tests-available.service';


@Component({
  selector: 'app-candidats-form',
  templateUrl: './candidats-form.component.html',
  styleUrls: ['./candidats-form.component.scss']
})
export class CandidatsFormComponent implements OnInit {
  private readonly emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

  @Input() globalId: number;
  @Input() status: string = "form";
  @Input() tests_available: number;
  @Output() onUpdateTestsAvailableWIP = new EventEmitter<any>();
  public form: FormGroup;
  public campaigns: any;
  private decryptTokenService = new DecryptTokenService();
  public candidats: Record<string, string>[];

  public Editor = ClassicEditor;
  public displayedMatTableColumns: string[] = ['name', 'email', 'icon'];

  public readonly sujet: string = 'Évaluation technique';
  public contenu: string;
  public editing: boolean = false;
  public htmlContent: string;

  public offer_id: any;
  public user_id: number;

  constructor(
    private fb: FormBuilder, public dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router,
    public apiClientService: ApiClientService, public dialogRef: MatDialogRef<CandidatsMailComponent>,
    private testsAvailable: TotalTestsAvailableService,
  ) {
    this.onUpdateTestsAvailableWIP = new EventEmitter();
  }

  ngOnInit() {
    this.form = this.fb.group({
      contacts: this.fb.array([this.createContact()])
    });

    this.user_id = this.decryptTokenService.userId;
    this.offer_id = this.decryptTokenService.offer_id;

    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .subscribe(datas => {
        this.campaigns = [datas];
      });

    this.htmlContent = this.customHtmlContent();
  }

  get contacts(): FormArray {
    return <FormArray>this.form.get('contacts');
  }

  createContact(): FormGroup {
    return this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      value: [null, Validators.compose([
        Validators.required,
        Validators.pattern(this.emailRegex)])]
    });
  }

  addContact(): void {
    if (this.contacts.length < this.tests_available) {
      this.contacts.push(this.createContact());
    } else {
      this.openSnackBar("Limite de test disponibles atteinte", "Fermer");
    }
  }

  removeContact(index: number): void {
    this.contacts.removeAt(index);
  }

  postCandidat(contactInfo: Record<string, string>): Promise<any> {
    this.switchTo('loading');

    return this.apiClientService.post(API_URI_CANDIDATS, {
        name: contactInfo.name,
        email: contactInfo.email,
        campaignId: this.globalId,
        emailTitle: this.sujet,
        emailContent: this.customHtmlContent(contactInfo.name),
        namePlaceholder: contactInfo.name
      })
      .toPromise()
      .then(res => {
        console.log('res', res.id);
        let candidatIDs: number[] = [];
        candidatIDs.push(res.id);
        return candidatIDs;
      }).then(candidatIDs => {
        this.updateCampaign(candidatIDs);
      }).catch(err => {
        this.openSnackBar("Une erreur est survenue", "Fermer");
      }).finally(() => {
        this.switchTo('sent');
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

  updateCampaignPostCandidats(): void {
    const totalCandidats: number = this.candidats.length;

    if (this.offer_id == 14) this.goToSubscribe();

    if (this.tests_available == -1) {
      for (const candidat of this.candidats) {
        this.postCandidat(candidat);
      }

      // update tests_available counter
      this.testsAvailable.updateValue(this.tests_available - totalCandidats);
    } else if (this.tests_available == 0) {
      setTimeout(() => this.goToSubscribe(), 1500);
      
      this.openSnackBar("Vous n'avez plus de test disponible", "Fermer");
    } else if (this.tests_available < totalCandidats) {
      // Note : this case should never happens as we have limited the number of candidats added to the number of tests_available
      setTimeout(() => this.retourCandidat(), 1500);

      this.openSnackBar(`Impossible d'inviter ${totalCandidats} candidat${totalCandidats > 1 ? 's' : ''}. Il vous reste seulement ${this.tests_available} test${this.tests_available > 1 ? 's' : ''} disponible${this.tests_available > 1 ? 's' : ''}`, "Fermer");
    } else {
      this.tests_available = this.tests_available - totalCandidats;
      
      this.apiClientService
        .put(API_URI_USER + '/' + this.user_id, {
          tests_available: this.tests_available,
        })
        .toPromise()
        .then((res) => {
          localStorage.setItem('currentUser', res.newToken);

          for (const candidat of this.candidats) {
            this.postCandidat(candidat);
          }

          // update tests_available counter
          this.testsAvailable.updateValue(this.tests_available);
        }).catch(
          err => console.log(err)
        );
    }
  }

  updateCampaign(candidatIDs: number[]): Promise<any> {
    return this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.globalId, {
        candidats: candidatIDs,
        email_title: this.sujet,
        email_content: this.htmlContent
      })
      .toPromise()
      .then((res) => {
        console.log('CANDIDATS', res);
      }).catch(
        err => console.log(err)
      );
  }

  retourCandidat(): void {
    this.dialogRef.close(this.tests_available);
  }

  validate(): boolean {
    // TODO : try to refacto with angular getError function ?
    return !this.form.controls["contacts"]["controls"].map(control => {
      return control.controls.name.errors === null && control.controls.value.errors === null;
    }).includes(false);
  }

  switchTo(status: string): void {
    let cdts: Record<string, string>[] = [];

    for (const contact of this.contacts.controls) {
      const ct = (contact as FormGroup).controls;
      
      const contactSanitized: Record<string, string> = {
        name: ct.name.value.trim(),
        email: ct.value.value.trim(),
      };
      cdts.push(contactSanitized);
    }
    
    this.candidats = cdts;

    this.status = status;
  }

  private customHtmlContent(candidatName: string = ''): string {
    const trimName: string = candidatName.trim() || '';
    const lowercaseName: string = trimName.toLowerCase() || '';
    const capitalizeName: string = lowercaseName ? lowercaseName[0].toUpperCase() + lowercaseName.slice(1) : '';

    return `<div><span style="background-color: transparent; font-size: 1rem;">Bonjour ${capitalizeName || '[nom du candidat]'},</span>
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
}
