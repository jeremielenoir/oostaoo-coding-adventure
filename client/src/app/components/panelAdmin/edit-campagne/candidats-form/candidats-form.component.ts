import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource, MatSort, MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CandidatsMailComponent } from '../candidats-mail/candidats-mail.component';
import { DecryptTokenService } from '../../../home/register/register.service';
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
export class CandidatsFormComponent implements OnInit, OnDestroy {
  private readonly emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

  @Input() globalId: number;
  @Input() status = 'form';
  @Input() tests_available: number;
  @Output() onUpdateTestsAvailableWIP = new EventEmitter<any>();
  private subscription: Subscription;
  public form: FormGroup;
  public campaigns: any;
  private decryptTokenService = new DecryptTokenService();
  public candidats: Record<string, string>[];
  public candidatsApplied$: Observable<boolean> = of(false);
  private emailsChecked: Map<string, boolean> = new Map(); // keep emails already checked to prevent recheck when form is updated

  public Editor = ClassicEditor;
  public displayedMatTableColumns: string[] = ['name', 'email', 'icon'];

  public readonly sujet: string = 'Évaluation technique';
  public contenu: string;
  public editing = false;
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

    // listen on form changes in order to prevent candidat to be add more than once to a campaign
    this.subscription = this.form.get('contacts').valueChanges.subscribe(contacts => {
        const contactControls: FormArray = this.contacts;

        for (const i in contacts) {
          if (contactControls.at(+i).get('value').valid) {
            const emailTrimed: string = contactControls.at(+i).value.value.trim();

            if (this.emailsChecked.has(emailTrimed)) {
              this.candidatsApplied$ = of(this.emailsChecked.get(emailTrimed));
            } else {
              this.subscription = this.hasCandidatApplied(emailTrimed).subscribe(applied => {
                this.emailsChecked.set(emailTrimed, applied);
                this.candidatsApplied$ = of(applied);
              });
            }
          }
        }
    });

    this.user_id = this.decryptTokenService.userId;
    this.offer_id = this.decryptTokenService.offer_id;

    this.subscription = this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .subscribe(datas => this.campaigns = [datas]);

    this.htmlContent = this.customHtmlContent();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get contacts(): FormArray {
    return <FormArray>this.form.get('contacts');
  }

  createContact(): FormGroup {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      value: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])]
    });
  }

  addContact(): void {
    if (this.contacts.length < this.tests_available) {
      this.contacts.push(this.createContact());
    } else {
      this.openSnackBar('Limite de test disponibles atteinte', 'Fermer');
    }
  }

  removeContact(index: number): void {
    this.contacts.removeAt(index);

    // check if left emails hasn't been already notified
    for (let i = 0; i < this.contacts.length; i++) {
      const email: string = this.contacts.at(i).value.value.trim();
      if (this.emailsChecked.get(email)) { this.candidatsApplied$ = of(true); }
    }
  }

  public hasApplied(idx: number): boolean {
    const email: string = this.contacts.at(idx)['controls'].value.value;
    return this.emailsChecked.get(email.trim());
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

    if (this.offer_id === 14) { this.goToSubscribe(); }

    this.tests_available = this.tests_available - totalCandidats;

    this.switchTo('loading');

    this.subscription = this.apiClientService.put(API_URI_USER + '/' + this.user_id, {
      tests_available: this.tests_available
    }).subscribe(user => {
      localStorage.setItem('currentUser', user.newToken);

      for (const candidat of this.candidats) {
        this.subscription = this.postCandidat(candidat).subscribe();
      }

      this.testsAvailable.updateValue(this.tests_available);

      this.switchTo('sent');
    });
  }

  postCandidat(contactInfo: Record<string, string>): Observable<any> {
    return this.apiClientService.post(API_URI_CANDIDATS, {
      name: contactInfo.name,
      email: contactInfo.email,
      campaignId: this.globalId,
      emailTitle: this.sujet,
      emailContent: this.customHtmlContent(contactInfo.name),
      namePlaceholder: contactInfo.name
    }).pipe(
      switchMap(result => {
        const candidatIDs: number[] = [];
        candidatIDs.push(result.id);
        return this.updateCampaign(candidatIDs);
      }),
      catchError(err => {
        this.openSnackBar('Une erreur est survenue', 'Fermer');
        return of(err);
      }),
    );
  }

  updateCampaign(candidatIDs: number[]): Observable<any> {
    return this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.globalId, {
      candidats: candidatIDs,
      email_title: this.sujet,
      email_content: this.htmlContent
    });
  }

  // hasCandidatApplied gets candidat then returns true if candidat is already in the current campaign, otherwise false
  private hasCandidatApplied(email: string): Observable<boolean> {
    return this.apiClientService.get(API_URI_CANDIDATS + `?email=${email}&campaign=${this.globalId}`).pipe(
      map(candidats => candidats.length > 0 && candidats[0].campaign.id === this.globalId ? true : false)
    );
  }

  retourCandidat(): void {
    this.dialogRef.close(this.tests_available);
  }

  validate(): boolean {
    return !this.form.controls['contacts']['controls'].map(control => control.controls.name.errors === null && control.controls.value.errors === null).includes(false);
  }

  switchTo(status: string): void {
    const cdts: Record<string, string>[] = [];

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

  close() {
    this.dialogRef.close(this.tests_available);
  }
}
