import { Component, OnInit, ViewChild, ElementRef, OnDestroy, SecurityContext } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiClientService, API_URI_USER, API_URI_ENTREPRISE, UPLOAD_TO_STRAPI } from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { DialogImagesComponent } from './dialog-images/dialog-images.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profil-entreprise',
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.scss']
})
export class ProfilEntrepriseComponent implements OnInit, OnDestroy {
  @ViewChild('paramHeader') paramHeader: ElementRef;
  @ViewChild('uploadimgfirst') uploadimgfirst: ElementRef;
  @ViewChild('uploadimgLast') uploadimgLast: ElementRef;
  @ViewChild('btnValideParent') btnValideParent: ElementRef;
  @ViewChild('btnValideParentAddImage') btnValideParentAddImage: ElementRef;
  @ViewChild('fileLoading') fileLoading: ElementRef;
  @ViewChild('uploadFileFirst') uploadFileFirst: ElementRef;

  entrepriseProfilForm: FormGroup;
  entrepriseLinksForm: FormGroup;
  private subscription: Subscription;
  readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  account: any;
  public currentValue: number;
  public user: any;
  public interval: any;
  public shadowcog = false;
  public shadowcogImage = false;
  public cadrageImgBoolean: boolean;
  public blockUpload = false;
  public cadrageImgBooleanState;
  public blockUploadLast = false;
  public cadrageImgBooleanLast = false;
  public cadrageImgBooleanStateLast = false;
  public current1 = 0;
  public current2 = 0;
  public currentTotal = 0;
  public entreprise: any = null;

  public isVerifUser = false;

  public entre: any;

  submitted = false;
  name = new FormControl('', Validators.required);
  newEntreprise = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  newEmail = new FormControl('', [Validators.required, Validators.email]);
  lang = new FormControl('');
  phone = new FormControl('', Validators.required);
  newPhone = new FormControl('', Validators.required);
  industrie = new FormControl('');
  numberofemployee = new FormControl('');
  numberofdev = new FormControl('');
  videolink = new FormControl('');
  websitelink = new FormControl('');
  teaser = new FormControl('');

  linkedin = new FormControl('');
  facebook = new FormControl('');
  twitter = new FormControl('');

  langlist = [
    'Albanais',
    'Allemand',
    'Arménien',
    'Biélorusse',
    'Bosniaque',
    'Bulgare',
    'Chinois',
    'Coréen',
    'Croate',
    'Danois',
    'Espagnol',
    'Estonien',
    'Finnois',
    'Français',
    'Georgien',
    'Grec',
    'Hongrois',
    'Indonésien',
    'Islandais',
    'Italien',
    'Japonais',
    'Lituanien',
    'Néerlandais',
    'Norvégien',
    'Polonais',
    'Portugais',
    'Roumain',
    'Russe',
    'Serbe',
    'Suédois',
    'Tchèque',
    'Turc',
    'Ukrainien',
    'Vietnamien'
  ];

  numberofemployeeList: string[] = ['1-9', '10-49', '50-199', '+200'];

  industrieList: string[] = [
    'Communications',
    'Game publisher',
    'Industry',
    'Internet',
    'IT Services',
    'Recruiting Agency',
    'Security',
    'Software',
    'Startup',
    'Other'
  ];

  dataRoute: any;
  disabled: boolean;
  public logo: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public formDataFile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public picture: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, public apiClientService: ApiClientService, public decryptTokenService: DecryptTokenService,
    private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private el: ElementRef, public dialog: MatDialog,
    private sanitizer: DomSanitizer) {
    this.entrepriseProfilForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lang: [''],
      phone: ['', Validators.required],
      industrie: [''],
      numberofemployee: [''],
      numberofdev: [''],
      videolink: [''],
      websitelink: [''],
      teaser: [''],
      linkedin: [''],
      facebook: [''],
      twitter: [''],
    });
    this.entrepriseLinksForm = this.formBuilder.group({
      videolink: [''],
      websitelink: [''],
      teaser: [''],
      linkedin: [''],
      facebook: [''],
      twitter: [''],
    });
  }

  ngOnInit() {
    this.loading$.next(true);
    // this.onChanges();
    this.apiClientService._user.subscribe(data => {
      if (data) {
        this.createDataRoutes(data);
      }
    });

    this.subscription = this.getUser().subscribe(user => {
      console.log('User : ', user);
      // this.account is only used here, maybe to remove ?
      this.account = user.customeraccount;
      // if (user[0].role.type === 'root') {
      //   this.router.navigate(['/dashboard/profil-utilisateur']); // role administrator strapi -> redirect to this route ?
      // }

      if (this.account.entreprise) {
        this.entrepriseProfilForm.controls['lang'].setValue(this.account.entreprise.lang);
        this.entrepriseProfilForm.controls['name'].setValue(this.account.entreprise.nom);
        this.entrepriseProfilForm.controls['email'].setValue(this.account.entreprise.email);
        this.entrepriseProfilForm.controls['phone'].setValue(this.account.entreprise.tel);
        this.entrepriseProfilForm.controls['industrie'].setValue(this.account.entreprise.industrie);
        this.entrepriseProfilForm.controls['numberofemployee'].setValue(this.account.entreprise.nb_employe);
        this.entrepriseProfilForm.controls['numberofdev'].setValue(this.account.entreprise.nb_dev);
        this.entrepriseLinksForm.controls['videolink'].setValue(this.account.entreprise.lien_video);
        this.entrepriseLinksForm.controls['websitelink'].setValue(this.account.entreprise.url_site);
        this.entrepriseLinksForm.controls['teaser'].setValue(this.account.entreprise.teaser);
        this.entrepriseLinksForm.controls['linkedin'].setValue(this.account.entreprise.linkedin);
        this.entrepriseLinksForm.controls['facebook'].setValue(this.account.entreprise.facebook);
        this.entrepriseLinksForm.controls['twitter'].setValue(this.account.entreprise.twitter);
        this.entreprise = this.account.entreprise;
        this.getEntreprise(user.customeraccount.entreprise.id);

        this.isVerifUser = true;
        this.progressbarTotal();
      } else {
        this.isVerifUser = true;
        console.log('no entreprise lel');
      }
      this.loading$.next(false);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createDataRoutes(user) {
    this.dataRoute = [
      {
        routerLink: '/dashboard/profil-utilisateur', condition: true,
        classAnimParent: 'hvr-icon-bounce', classAnimIcone: 'hvr-icon', icon: 'person_outline', name: 'Mon profil'
      },
      {
        routerLink: '/dashboard/profil-entreprise', condition: user['customeraccount'].type === 'profesional',
        classAnimParent: 'hvr-icon-bounce', classAnimIcone: 'hvr-icon', icon: 'domain', name: 'Mon entreprise'
      },
      {
        routerLink: '/dashboard/utilisateurs', condition: true, classAnimParent: 'hvr-icon-bounce',
        classAnimIcone: 'hvr-icon', icon: 'groups', name: 'Utilisateurs'
      }
    ];
  }

  addEntreprise() {
    this.submitted = true;

    if (this.entrepriseProfilForm.valid) {
      this.apiClientService
        .post(API_URI_ENTREPRISE, {
          Nom: this.entrepriseProfilForm.controls['name'].value,
          Email: this.entrepriseProfilForm.controls['email'].value,
          Tel: this.entrepriseProfilForm.controls['phone'].value
        }).subscribe(
          res => {
            this.ngOnInit();
            this.openSnackBar('L\'entreprise a correctement été ajoutée', 'Fermer');
          },
          err => {
            this.openSnackBar(err.message ? err.message :
              'Oops ! l\'ajout d\'entreprise est indisponible', 'Ok');
          });
    } else {
      this.openSnackBar('Une erreur est survenue, veuillez correctement remplir les champs requis', 'Fermer');
      return;
    }
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['mat-snack-bar-container']
    });
  }

  progressbarTotal() {
    const total = [
      this.lang.value,
      this.videolink.value,
      this.websitelink.value,
      this.teaser.value,
      this.name.value,
      this.email.value,
      this.phone.value,
      this.industrie.value,
      this.numberofemployee.value,
      this.numberofdev.value,
      this.linkedin.value,
      this.facebook.value,
      this.twitter.value
    ];
    const percent = 100 / total.length;
    for (const element of total) {
      if (element !== null && element !== '') {
        this.currentTotal = this.currentTotal + percent;
      }
    }
    this.currentTotal = Math.trunc(this.currentTotal);
  }

  private getUser(): Observable<Record<string, any>> {
    return this.apiClientService.get(API_URI_USER + '/' + this.decryptTokenService.userId);
  }

  getEntreprise(idEntreprise) {
    return this.apiClientService
      .get(API_URI_ENTREPRISE + '/' + idEntreprise).subscribe(data => {
        console.log('data : ', data);
        if (data.logo) {
          this.logo.next(data.logo.url);
        }
        this.picture.next(this.account.entreprise.image_entreprise);
        return this.entreprise = data;
      });
  }

  // convenience getter for easy access to form fields
  get entrepriseFormControl() {
    return this.entrepriseProfilForm.controls;
  }

  updateProfilEntreprise() {
    this.submitted = true;
    if (this.formDataFile.value) {
      this.uploadImage(this.formDataFile.value);
    }
    if (this.entrepriseProfilForm.valid && !this.formDataFile.value) {
      this.postUpdateEntreprise();
    }
  }

  postUpdateEntreprise() {
    this.apiClientService
      .put(API_URI_ENTREPRISE + '/' + this.entreprise.id, {
        lang: this.entrepriseProfilForm.controls['lang'].value,
        Nom: this.entrepriseProfilForm.controls['name'].value,
        Email: this.entrepriseProfilForm.controls['email'].value,
        Tel: this.entrepriseProfilForm.controls['phone'].value,
        industrie: this.entrepriseProfilForm.controls['industrie'].value,
        Nb_employe: this.entrepriseProfilForm.controls['numberofemployee'].value,
        Nb_dev: this.entrepriseProfilForm.controls['numberofdev'].value,
      })
      .subscribe(
        res => {
          this.currentTotal = 0;
          this.ngOnInit();
          this.openSnackBar('Profil entreprise mis à jour aves succès', 'Ok');
        },
        err => {
          this.openSnackBar(err.message ? err.message :
            'Oops ! la mise à jour du profil entreprise est indisponible', 'Ok');
        }
      );
  }

  updateLinksEntreprise() {
    this.submitted = true;
    if (this.entrepriseLinksForm.valid) {
      this.apiClientService
        .put(API_URI_ENTREPRISE + '/' + this.entreprise.id, {
          Lien_video: this.entrepriseLinksForm.controls['videolink'].value,
          Url_site: this.entrepriseLinksForm.controls['websitelink'].value,
          Teaser: this.entrepriseLinksForm.controls['teaser'].value,
          Linkedin: this.entrepriseLinksForm.controls['linkedin'].value,
          Facebook: this.entrepriseLinksForm.controls['facebook'].value,
          Twitter: this.entrepriseLinksForm.controls['twitter'].value
        })
        .subscribe(
          res => {
            this.currentTotal = 0;
            this.ngOnInit();
            this.openSnackBar('Profil entreprise mis à jour aves succès', 'Ok');
          },
          err => {
            this.openSnackBar(err.message ? err.message :
              'Oops ! la mise à jour du profil entreprise est indisponible', 'Ok');
          }
        );
    } else {
      // this.openSnackBar('Une erreur est survenue, veuillez correctement remplir les champs requis', 'Fermer');
      return;
    }
  }

  openDialog(numbertObjects: number, limit_size: number, type_size: string, ref, field) {
    // numbertObjects limit of files
    // files: The file(s) to upload.The value(s) can be a Buffer or Stream.
    // path: (optional): The folder where the file(s) will be uploaded to(only supported on strapi - upload - aws - s3 now).
    // refId: (optional): The ID of the entry which the file(s) will be linked to.
    // ref: (optional): The name of the model which the file(s) will be linked to.
    // source: (optional): The name of the plugin where the model is located.
    // field: (optional): The field of the entry which the file(s) will be precisely linked to.
    // type_size = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
    const dialogRef = this.dialog.open(DialogImagesComponent, {
      width: '600px',
      data: {
        limit: numbertObjects, limit_size: limit_size, type_size: type_size,
        refId: this.entreprise.id,
        ref: ref,
        field: field
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.formDataFile.next(result.formData);
      console.log('Dialog result: ', result);
      if (result.field === 'logo') {
        this.logo.next(this.sanitizer.sanitize(
          SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(result.files[0].url)
        ));
      } else {
        const multImages = [];
        for (const file of result.files) {
          multImages.push({
            name: file.name,
            url: this.sanitizer.sanitize(
              SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(file.url)
            )
          });
        }
        console.log('multImages : ', multImages);
        this.picture.next(multImages);
        console.log('this.picture : ', this.picture);
      }
    });
  }

  uploadImage(formFile) {
    return this.apiClientService.post(UPLOAD_TO_STRAPI, formFile).subscribe(data => {
      console.log('Post upload file : ', data);
      this.logo.next(data[0].url);
      this.formDataFile.next(null);
      return data;
    },
      (err) => {
        console.log(err);
      });
  }

  // onChanges(): void {
  //   this.entrepriseProfilForm.valueChanges.subscribe(val => {
  //     console.log('VALUES : ', val);
  //   });
  // }
}
