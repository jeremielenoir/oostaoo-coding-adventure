import { Component, OnInit, ViewChild, ElementRef, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import {
  ApiClientService,
  API_URI_USER,
  API_URI_ENTREPRISE
} from "src/app/api-client/api-client.service";
import { DecryptTokenService } from "src/app/components/home/register/register.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: "app-profil-entreprise",
  templateUrl: "./profil-entreprise.component.html",
  styleUrls: ["./profil-entreprise.component.scss"]
})
export class ProfilEntrepriseComponent implements OnInit {
  @ViewChild("paramHeader") paramHeader: ElementRef;
  @ViewChild("uploadimgfirst") uploadimgfirst: ElementRef;
  @ViewChild("uploadimgLast") uploadimgLast: ElementRef;
  @ViewChild("btnValideParent") btnValideParent: ElementRef;
  @ViewChild("btnValideParentAddImage") btnValideParentAddImage: ElementRef;
  @ViewChild('fileLoading') fileLoading: ElementRef;
  @ViewChild('uploadFileFirst') uploadFileFirst: ElementRef;

  public currentValue: number;
  public user: any;
  public tests_available: any;
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
  logo: any;
  name = new FormControl("", Validators.required);
  newEntreprise = new FormControl("", Validators.required);
  email = new FormControl("", Validators.required);
  newEmail = new FormControl("", [Validators.required, Validators.email]);
  lang = new FormControl("");
  phone = new FormControl("", Validators.required);
  newPhone = new FormControl("", Validators.required);
  industrie = new FormControl("");
  numberofemployee = new FormControl("");
  numberofdev = new FormControl("");
  videolink = new FormControl("");
  websitelink = new FormControl("");
  teaser = new FormControl("");
  picture = [];
  linkedin = new FormControl("");
  facebook = new FormControl("");
  twitter = new FormControl("");

  langlist = [
    'Albanais', 'Allemand', 'Arménien', 'Biélorusse', 'Bosniaque', 'Bulgare', 'Chinois', 'Coréen', 'Croate', 'Danois', 'Espagnol',
    'Estonien', 'Finnois', 'Français', 'Georgien', 'Grec', 'Hongrois', 'Indonésien', 'Islandais', 'Italien', 'Japonais', 'Lituanien',
    'Néerlandais', 'Norvégien', 'Polonais', 'Portugais', 'Roumain', 'Russe', 'Serbe',
    'Suédois', 'Tchèque', 'Turc', 'Ukrainien', 'Vietnamien'
  ];

  numberofemployeeList: string[] = ['1-9', '10-49', '50-199', '+200'];

  industrieList: string[] = [
    "Communications",
    "Game publisher",
    "Industry",
    "Internet",
    "IT Services",
    "Recruiting Agency",
    "Security",
    "Software",
    "Startup",
    "Other"
  ];

  constructor(private router: Router,
    public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    private _snackBar: MatSnackBar,
  ) { }


  ngOnInit() {

    this.getUser().then(user => {
      console.log('user getUser=', user);
      console.log('this this user', this.entreprise);
      this.tests_available = user[0].tests_available;

      if ( user[0].entreprise === null) {
        this.isVerifUser = true;
        return console.log('no entreprise lel');
      } else {
      this.getentreprise().then(entreprise => {
        console.log('entrepriseeeeuh', entreprise);
        this.name = new FormControl(entreprise[0].nom, Validators.required);
        this.email = new FormControl(entreprise[0].email, [Validators.required, Validators.email]);
        this.lang = new FormControl(entreprise[0].lang);
        this.phone = new FormControl(entreprise[0].tel, Validators.required);
        this.industrie = new FormControl(entreprise[0].industrie);
        this.numberofemployee = new FormControl(entreprise[0].nb_employe);
        this.numberofdev = new FormControl(entreprise[0].nb_dev);
        this.videolink = new FormControl(entreprise[0].lien_video);
        this.websitelink = new FormControl(entreprise[0].url_site);
        this.teaser = new FormControl(entreprise[0].teaser);
        this.picture = entreprise[0].image_entreprise;
        this.linkedin = new FormControl(entreprise[0].linkedin);
        this.facebook = new FormControl(entreprise[0].facebook);
        this.twitter = new FormControl(entreprise[0].twitter);
        this.entreprise = entreprise[0];
        if ( entreprise[0].logo !== undefined) {
          this.logo = entreprise[0].logo.url;
        }
        console.log('entreprise user', entreprise);
        console.log('this.entreprise=', this.entreprise.logo);
        console.log('entreprise picture', this.picture);
        // this.progressbar1();
        // this.progressbar2();
        this.isVerifUser = true;
        this.progressbarTotal();
      });
    }
    });

  }

  addentreprise() {
    this.submitted = true;

    if (this.newEntreprise.value === '' || this.newEmail.value === '' || this.newPhone.value === '' || this.newEmail.invalid) {
      this.openSnackBar("Une erreur est survenue, veuillez correctement remplir tous les champs requis", "Fermer")
    } else {
        if(this.tests_available !== -1){
          setTimeout(()=>{
            this.router.navigate(['/subscription'])
          }, 1500 );
        }
      this.apiClientService.post(API_URI_ENTREPRISE, {
        Nom: this.newEntreprise.value,
        Email: this.newEmail.value,
        Tel: this.newPhone.value,
        useradmin: this.decryptTokenService.userId
      }).subscribe(
        (res) => {
          this.ngOnInit();
          this.openSnackBar("L'entreprise a correctement été ajoutée", "Fermer")
        },
        err => console.log(err)
      );
    }
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  clickchange() {
    // console.log('this.user :', this.user);
    this.apiClientService.put(API_URI_ENTREPRISE + '/' + this.entreprise.id, {
      lang: this.lang.value,
      Lien_video: this.videolink.value,
      Url_site: this.websitelink.value,
      Teaser: this.teaser.value
    }).subscribe(
      (res) => {
        // console.log('res', res);
      },
      err => console.log(err)
    );
  }

  clickchange2() {
    console.log('bonjour' + this.name.value)
    this.submitted = true;
    if (this.name.value === '' || this.email.value === '' || this.phone.value === '' || this.email.invalid) {
      return console.log('password not updated');
    } else {
      this.apiClientService.put(API_URI_ENTREPRISE + '/' + this.entreprise.id, {
        lang: this.lang.value,
        Nom: this.name.value,
        Email: this.email.value,
        Tel: this.phone.value,
        industrie: this.industrie.value,
        Nb_employe: this.numberofemployee.value,
        Nb_dev: this.numberofdev.value,
        Lien_video: this.videolink.value,
        Url_site: this.websitelink.value,
        Teaser: this.teaser.value,
        Linkedin: this.linkedin.value,
        Facebook: this.facebook.value,
        Twitter: this.twitter.value,
      }).subscribe(
        (res) => {
          this.currentTotal = 0;
          this.ngOnInit();
          // console.log('res', res);
        },
        err => console.log(err)
      );
    }
  }

  uploadLogo() {
    const formElement = document.querySelector('.formlogo') as any;
    const request = new XMLHttpRequest();
    request.open('POST', '/upload');
    request.send(new FormData(formElement));
  }

  uploadImage() {
    const formElement = document.querySelector('.formimage') as any;
    const request = new XMLHttpRequest();
    request.open('POST', '/upload');
    request.send(new FormData(formElement));
  }

  verifExtension(chemin) {
    const longueur = chemin.length;
    const indiceDebut = longueur - 4;
    const indiceFin = longueur;
    const extension = chemin.substr(indiceDebut, indiceFin);

    return extension;
  }
  public modal_upload() {
    this.shadowcog = true;
  }

  public param_cog_non_active() {
    this.shadowcog = false;
    this.btnValideParent.nativeElement.children[0].disabled = true;
    this.cadrageImgBoolean = false;
    this.blockUpload = false;
    this.uploadimgfirst.nativeElement.src = "";
    console.log('uploadFileFirst', this.uploadFileFirst.nativeElement)
    this.uploadFileFirst.nativeElement.value = ''
  }

  public show_header_param() {
    this.paramHeader.nativeElement.classList.toggle("active-param-header");
  }

  // function modal add images

  param_cog_non_active_add_image() {
    this.shadowcogImage = true;
  }

  public param_cog_non_active_add_img() {
    this.shadowcogImage = false;

    this.btnValideParentAddImage.nativeElement.children[0].disabled = true;
    this.cadrageImgBooleanLast = false;
    this.blockUploadLast = false;
    this.uploadimgLast.nativeElement.src = "salut";
    this.fileLoading.nativeElement.value = ''
  }

  readURL(event) {
    if (event.target.files && event.target.files[0]) {
      this.blockUpload = true;
      this.cadrageImgBoolean = true;

      const extensionsAutorise = [
        ".png",
        ".gif",
        ".jpg",
        ".jpeg",
        ".PNG",
        ".GIF",
        ".JPG",
        ".JPEG"
      ];
      const extension = this.verifExtension(event.target.value);

      if (
        extension === extensionsAutorise[0] ||
        extension === extensionsAutorise[1] ||
        extension === extensionsAutorise[2] ||
        extension === extensionsAutorise[3] ||
        extension === extensionsAutorise[4] ||
        extension === extensionsAutorise[5] ||
        extension === extensionsAutorise[6] ||
        extension === extensionsAutorise[7]
      ) {
        this.cadrageImgBooleanState = false;

        this.btnValideParent.nativeElement.children[0].disabled = false;

        this.uploadimgfirst.nativeElement.src = URL.createObjectURL(
          event.target.files[0]
        );
      } else {
        this.cadrageImgBooleanState = true;
        this.btnValideParent.nativeElement.children[0].disabled = true;
      }
    }
  }

  // progressbar1() {
  //   const total = [this.lang.value, this.videolink.value, this.websitelink.value, this.teaser.value];
  //   const percent = 25;


  //   for (const element of total) {
  //     if (element !== null && element !== '') {
  //       this.current1 = this.current1 + percent;

  //       this.current1 = Math.round(this.current1);
  //     }

  //   }
  // }
  // progressbar2() {

  //   const total = [
  //     this.name.value, this.email.value, this.phone.value,
  //     this.industrie.value, this.numberofemployee.value,
  //     this.numberofdev.value, this.videolink.value, this.websitelink.value,
  //     this.teaser.value, this.linkedin.value, this.facebook.value, this.twitter.value
  //   ];
  //   const percent = 8.33333333;
  //   for (const element of total) {
  //     if (element !== null && element !== '') {
  //       this.current2 = this.current2 + percent;
  //       this.current2 = Math.trunc(this.current2);
  //     }

  //   }
  // }
  progressbarTotal() {
    const total = [
      this.lang.value, this.videolink.value, this.websitelink.value, this.teaser.value,
      this.name.value, this.email.value, this.phone.value,
      this.industrie.value, this.numberofemployee.value, this.numberofdev.value,
      this.linkedin.value, this.facebook.value, this.twitter.value
    ];
    const percent = 100 / total.length ;
    for (const element of total) {
      if (element !== null && element !== '') {
        this.currentTotal = this.currentTotal + percent;
      }
    }
    this.currentTotal = Math.trunc(this.currentTotal);

  }

  readURL_deux(event) {
    this.blockUploadLast = true;
    this.cadrageImgBooleanLast = true;

    const extensionsAutorise = [
      ".png",
      ".gif",
      ".jpg",
      ".jpeg",
      ".PNG",
      ".GIF",
      ".JPG",
      ".JPEG"
    ];
    const extension = this.verifExtension(event.target.value);

    if (
      extension === extensionsAutorise[0] ||
      extension === extensionsAutorise[1] ||
      extension === extensionsAutorise[2] ||
      extension === extensionsAutorise[3] ||
      extension === extensionsAutorise[4] ||
      extension === extensionsAutorise[5] ||
      extension === extensionsAutorise[6] ||
      extension === extensionsAutorise[7]
    ) {
      this.cadrageImgBooleanStateLast = false;


      this.uploadimgLast.nativeElement.src = URL.createObjectURL(
        event.target.files[0]
      );

      this.btnValideParentAddImage.nativeElement.children[0].disabled = false;
    } else {
      this.cadrageImgBooleanStateLast = true;

      this.btnValideParent.nativeElement.children[0].disabled = true;
    }
  }

  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER + '/' + this.decryptTokenService.userId)
        .toPromise();
      return this.user = [datas];
    } catch (err) {
      return err;
    }
  }

  async getentreprise(): Promise<any> {
    try {
      const user = await this.user;
      const datas = await this.apiClientService
        .get(API_URI_ENTREPRISE + '/' + user[0].entreprise.id)
        .toPromise();
      return this.entre = [datas];
    } catch (err) {
      return err;
    }
  }

}
