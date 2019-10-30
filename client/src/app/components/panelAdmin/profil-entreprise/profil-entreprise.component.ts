import { Component, OnInit, QueryList, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiClientService, API_URI_USER, API_URI_ENTREPRISE } from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';

@Component({
  selector: 'app-profil-entreprise',
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.scss']
})

export class ProfilEntrepriseComponent implements OnInit {

  @ViewChild('paramHeader') paramHeader: ElementRef;
  @ViewChild('uploadimgfirst') uploadimgfirst: ElementRef;
  @ViewChild('uploadimgLast') uploadimgLast: ElementRef;
  @ViewChild('btnValideParent') btnValideParent: ElementRef;
  @ViewChild('btnValideParentAddImage') btnValideParentAddImage: ElementRef;



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

  logo = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  lang = new FormControl('', Validators.required);
  phone = new FormControl('', Validators.required);
  industrie = new FormControl('', Validators.required);
  numberofemployee = new FormControl('', Validators.required);
  numberofdev = new FormControl('', Validators.required);
  techno = new FormControl('', Validators.required);
  videolink = new FormControl('', Validators.required);
  websitelink = new FormControl('', Validators.required);
  teaser = new FormControl('', Validators.required);
  picture = new FormControl('', Validators.required);
  linkedin = new FormControl('', Validators.required);
  facebook = new FormControl('', Validators.required);
  twitter = new FormControl('', Validators.required);

  langlist = [
    {
      code: 'ab',
      name: 'Abkhaz'
    },
    {
      code: 'aa',
      name: 'Afar'
    },
    {
      code: 'af',
      name: 'Afrikaans'
    },
    {
      code: 'ak',
      name: 'Akan'
    },
    {
      code: 'sq',
      name: 'Albanian'
    },
    {
      code: 'am',
      name: 'Amharic'
    },
    {
      code: 'ar',
      name: 'Arabic'
    },
    {
      code: 'an',
      name: 'Aragonese'
    },
    {
      code: 'hy',
      name: 'Armenian'
    },
    {
      code: 'as',
      name: 'Assamese'
    },
    {
      code: 'av',
      name: 'Avaric'
    },
    {
      code: 'ae',
      name: 'Avestan'
    },
    {
      code: 'ay',
      name: 'Aymara'
    },
    {
      code: 'az',
      name: 'Azerbaijani'
    },
    {
      code: 'bm',
      name: 'Bambara'
    },
    {
      code: 'ba',
      name: 'Bashkir'
    },
    {
      code: 'eu',
      name: 'Basque'
    },
    {
      code: 'be',
      name: 'Belarusian'
    },
    {
      code: 'bn',
      name: 'Bengali'
    },
    {
      code: 'bh',
      name: 'Bihari'
    },
    {
      code: 'bi',
      name: 'Bislama'
    },
    {
      code: 'bs',
      name: 'Bosnian'
    },
    {
      code: 'br',
      name: 'Breton'
    },
    {
      code: 'bg',
      name: 'Bulgarian'
    },
    {
      code: 'my',
      name: 'Burmese'
    },
    {
      code: 'ca',
      name: 'Catalan'
    },
    {
      code: 'ch',
      name: 'Chamorro'
    },
    {
      code: 'ce',
      name: 'Chechen'
    },
    {
      code: 'ny',
      name: 'Nyanja'
    },
    {
      code: 'zh',
      name: 'Chinese'
    },
    {
      code: 'cv',
      name: 'Chuvash'
    },
    {
      code: 'kw',
      name: 'Cornish'
    },
    {
      code: 'co',
      name: 'Corsican'
    },
    {
      code: 'cr',
      name: 'Cree'
    },
    {
      code: 'hr',
      name: 'Croatian'
    },
    {
      code: 'cs',
      name: 'Czech'
    },
    {
      code: 'da',
      name: 'Danish'
    },
    {
      code: 'dv',
      name: 'Divehi'
    },
    {
      code: 'nl',
      name: 'Dutch'
    },
    {
      code: 'dz',
      name: 'Dzongkha'
    },
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'eo',
      name: 'Esperanto'
    },
    {
      code: 'et',
      name: 'Estonian'
    },
    {
      code: 'ee',
      name: 'Ewe'
    },
    {
      code: 'fo',
      name: 'Faroese'
    },
    {
      code: 'fj',
      name: 'Fijian'
    },
    {
      code: 'fi',
      name: 'Finnish'
    },
    {
      code: 'fr',
      name: 'French'
    },
    {
      code: 'ff',
      name: 'Fula'
    },
    {
      code: 'gl',
      name: 'Galician'
    },
    {
      code: 'ka',
      name: 'Georgian'
    },
    {
      code: 'de',
      name: 'German'
    },
    {
      code: 'el',
      name: 'Greek'
    },
    {
      code: 'gn',
      name: 'GuaranÃ­'
    },
    {
      code: 'gu',
      name: 'Gujarati'
    },
    {
      code: 'ht',
      name: 'Haitian'
    },
    {
      code: 'ha',
      name: 'Hausa'
    },
    {
      code: 'he',
      name: 'Hebrew'
    },
    {
      code: 'hz',
      name: 'Herero'
    },
    {
      code: 'hi',
      name: 'Hindi'
    },
    {
      code: 'ho',
      name: 'Hiri Motu'
    },
    {
      code: 'hu',
      name: 'Hungarian'
    },
    {
      code: 'ia',
      name: 'Interlingua'
    },
    {
      code: 'id',
      name: 'Indonesian'
    },
    {
      code: 'ie',
      name: 'Interlingue'
    },
    {
      code: 'ga',
      name: 'Irish'
    },
    {
      code: 'ig',
      name: 'Igbo'
    },
    {
      code: 'ik',
      name: 'Inupiaq'
    },
    {
      code: 'io',
      name: 'Ido'
    },
    {
      code: 'is',
      name: 'Icelandic'
    },
    {
      code: 'it',
      name: 'Italian'
    },
    {
      code: 'iu',
      name: 'Inuktitut'
    },
    {
      code: 'ja',
      name: 'Japanese'
    },
    {
      code: 'jv',
      name: 'Javanese'
    },
    {
      code: 'kl',
      name: 'Kalaallisut'
    },
    {
      code: 'kn',
      name: 'Kannada'
    },
    {
      code: 'kr',
      name: 'Kanuri'
    },
    {
      code: 'ks',
      name: 'Kashmiri'
    },
    {
      code: 'kk',
      name: 'Kazakh'
    },
    {
      code: 'km',
      name: 'Khmer'
    },
    {
      code: 'ki',
      name: 'Kikuyu'
    },
    {
      code: 'rw',
      name: 'Kinyarwanda'
    },
    {
      code: 'ky',
      name: 'Kyrgyz'
    },
    {
      code: 'kv',
      name: 'Komi'
    },
    {
      code: 'kg',
      name: 'Kongo'
    },
    {
      code: 'ko',
      name: 'Korean'
    },
    {
      code: 'ku',
      name: 'Kurdish'
    },
    {
      code: 'kj',
      name: 'Kwanyama'
    },
    {
      code: 'la',
      name: 'Latin'
    },
    {
      code: 'lb',
      name: 'Luxembourgish'
    },
    {
      code: 'lg',
      name: 'Ganda'
    },
    {
      code: 'li',
      name: 'Limburgish'
    },
    {
      code: 'ln',
      name: 'Lingala'
    },
    {
      code: 'lo',
      name: 'Lao'
    },
    {
      code: 'lt',
      name: 'Lithuanian'
    },
    {
      code: 'lu',
      name: 'Luba-Katanga'
    },
    {
      code: 'lv',
      name: 'Latvian'
    },
    {
      code: 'gv',
      name: 'Manx'
    },
    {
      code: 'mk',
      name: 'Macedonian'
    },
    {
      code: 'mg',
      name: 'Malagasy'
    },
    {
      code: 'ms',
      name: 'Malay'
    },
    {
      code: 'ml',
      name: 'Malayalam'
    },
    {
      code: 'mt',
      name: 'Maltese'
    },
    {
      code: 'mi',
      name: 'MÄori'
    },
    {
      code: 'mr',
      name: 'Marathi'
    },
    {
      code: 'mh',
      name: 'Marshallese'
    },
    {
      code: 'mn',
      name: 'Mongolian'
    },
    {
      code: 'na',
      name: 'Nauru'
    },
    {
      code: 'nv',
      name: 'Navajo'
    },
    {
      code: 'nb',
      name: 'Norwegian'
    },
    {
      code: 'nd',
      name: 'North'
    },
    {
      code: 'ne',
      name: 'Nepali'
    },
    {
      code: 'ng',
      name: 'Ndonga'
    },
    {
      code: 'nn',
      name: 'Norwegian Nynorsk'
    },
    {
      code: 'no',
      name: 'Norwegian'
    },
    {
      code: 'ii',
      name: 'Nuosu'
    },
    {
      code: 'nr',
      name: 'South Ndebele'
    },
    {
      code: 'oc',
      name: 'Occitan'
    },
    {
      code: 'oj',
      name: 'Ojibwe, Ojibwa'
    },
    {
      code: 'cu',
      name: 'Old Church Slavonic'
    },
    {
      code: 'om',
      name: 'Oromo'
    },
    {
      code: 'or',
      name: 'Oriya'
    },
    {
      code: 'os',
      name: 'Ossetian'
    },
    {
      code: 'pa',
      name: 'Panjabi'
    },
    {
      code: 'pi',
      name: 'PÄli'
    },
    {
      code: 'fa',
      name: 'Persian (Farsi)'
    },
    {
      code: 'pl',
      name: 'Polish'
    },
    {
      code: 'ps',
      name: 'Pashto'
    },
    {
      code: 'pt',
      name: 'Portuguese'
    },
    {
      code: 'qu',
      name: 'Quechua'
    },
    {
      code: 'rm',
      name: 'Romansh'
    },
    {
      code: 'rn',
      name: 'Kirundi'
    },
    {
      code: 'ro',
      name: 'Romanian, [])'
    },
    {
      code: 'ru',
      name: 'Russian'
    },
    {
      code: 'sa',
      name: 'Sanskrit'
    },
    {
      code: 'sc',
      name: 'Sardinian'
    },
    {
      code: 'sd',
      name: 'Sindhi'
    },
    {
      code: 'se',
      name: 'Northern Sami'
    },
    {
      code: 'sm',
      name: 'Samoan'
    },
    {
      code: 'sg',
      name: 'Sango'
    },
    {
      code: 'sr',
      name: 'Serbian'
    },
    {
      code: 'gd',
      name: 'Scottish Gaelic'
    },
    {
      code: 'sn',
      name: 'Shona'
    },
    {
      code: 'si',
      name: 'Sinhala'
    },
    {
      code: 'sk',
      name: 'Slovak'
    },
    {
      code: 'sl',
      name: 'Slovene'
    },
    {
      code: 'so',
      name: 'Somali'
    },
    {
      code: 'st',
      name: 'Southern Sotho'
    },
    {
      code: 'az',
      name: 'South Azerbaijani'
    },
    {
      code: 'es',
      name: 'Spanish'
    },
    {
      code: 'su',
      name: 'Sundanese'
    },
    {
      code: 'sw',
      name: 'Swahili'
    },
    {
      code: 'ss',
      name: 'Swati'
    },
    {
      code: 'sv',
      name: 'Swedish'
    },
    {
      code: 'ta',
      name: 'Tamil'
    },
    {
      code: 'te',
      name: 'Telugu'
    },
    {
      code: 'tg',
      name: 'Tajik'
    },
    {
      code: 'th',
      name: 'Thai'
    },
    {
      code: 'ti',
      name: 'Tigrinya'
    },
    {
      code: 'bo',
      name: 'Tibetan Standard'
    },
    {
      code: 'tk',
      name: 'Turkmen'
    },
    {
      code: 'tl',
      name: 'Tagalog'
    },
    {
      code: 'tn',
      name: 'Tswana'
    },
    {
      code: 'to',
      name: 'Tonga (Tonga Islands)'
    },
    {
      code: 'tr',
      name: 'Turkish'
    },
    {
      code: 'ts',
      name: 'Tsonga'
    },
    {
      code: 'tt',
      name: 'Tatar'
    },
    {
      code: 'tw',
      name: 'Twi'
    },
    {
      code: 'ty',
      name: 'Tahitian'
    },
    {
      code: 'ug',
      name: 'Uyghur'
    },
    {
      code: 'uk',
      name: 'Ukrainian'
    },
    {
      code: 'ur',
      name: 'Urdu'
    },
    {
      code: 'uz',
      name: 'Uzbek'
    },
    {
      code: 've',
      name: 'Venda'
    },
    {
      code: 'vi',
      name: 'Vietnamese'
    },
    {
      code: 'vo',
      name: 'VolapÃ¼k'
    },
    {
      code: 'wa',
      name: 'Walloon'
    },
    {
      code: 'cy',
      name: 'Welsh'
    },
    {
      code: 'wo',
      name: 'Wolof'
    },
    {
      code: 'fy',
      name: 'Western Frisian'
    },
    {
      code: 'xh',
      name: 'Xhosa'
    },
    {
      code: 'yi',
      name: 'Yiddish'
    },
    {
      code: 'yo',
      name: 'Yoruba'
    },
    {
      code: 'za',
      name: 'Zhuang, Chuang'
    },
    {
      code: 'zu',
      name: 'Zulu'
    }
  ];

  numberofemployeeList: string[] = ['1-9', '10-49', '50-199', '+200'];

  industrieList: string[] = ['Communications', 'Game publisher', 'Industry', 'Internet',
    'IT Services', 'Recruiting Agency', 'Security', 'Software', 'Startup', 'Other'];

  toppingList: string[] = ['Ada', 'Android', 'Bash', 'Big Data',
    'C', 'C++', 'C#', 'Clojure', 'Cloud', 'Cobol', 'DBA', 'Dart', 'Delphi',
    '.NET', 'F#'];

  constructor(public apiClientService: ApiClientService, public decryptTokenService: DecryptTokenService) {
  }

  ngOnInit() {
    this.getUser().then(user => {
      console.log(user[0].entreprise);
      this.logo = new FormControl(user[0].entreprise.logo);
      this.name = new FormControl(user[0].entreprise.nom);
      this.email = new FormControl(user[0].entreprise.email);
      this.lang = new FormControl(user[0].entreprise.langue);
      this.phone = new FormControl(user[0].entreprise.tel);
      this.industrie = new FormControl(user[0].entreprise.mobile);
      this.numberofemployee = new FormControl(user[0].entreprise.nb_employe);
      this.numberofdev = new FormControl(user[0].entreprise.nb_dev);
      this.techno = new FormControl(user[0].entreprise.techno);
      this.videolink = new FormControl(user[0].entreprise.lien_video);
      this.websitelink = new FormControl(user[0].entreprise.url_site);
      this.teaser = new FormControl(user[0].entreprise.teaser);
      this.picture = new FormControl(user[0].entreprise.picture);
      this.linkedin = new FormControl(user[0].entreprise.linkedin);
      this.facebook = new FormControl(user[0].entreprise.facebook);
      this.twitter = new FormControl(user[0].entreprise.twitter);
      // console.log('form before =', this.name.value, this.lang.value, this.copypasteControl.value, this.rapportControl.value);
    });
    console.log('test', this.decryptTokenService.userId);

  }

  clickchange() {

    this.apiClientService.put(API_URI_ENTREPRISE + '/' + this.user[0].entreprise.id, {
      Lien_video: this.videolink.value,
      Url_site: this.websitelink.value,
      Teaser: this.teaser.value
    }).subscribe(
      (res) => {
        alert('Profil mis à jour');
        // console.log('res', res);
      },
      err => console.log(err)
    );
    console.log(this.lang.value);
    console.log(this.user[0].entreprise.id);
    console.log(this.websitelink.value);
    console.log(this.teaser.value);
  }

  clickchange2() {
    this.apiClientService.put(API_URI_ENTREPRISE + '/' + this.user.entreprise.id, {
      Nom: this.name.value,
      Email: this.email.value,
      Tel: this.phone.value,
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
        alert('Profil mis à jour');
        // console.log('res', res);
      },
      err => console.log(err)
    );
    console.log(this.name.value);
    console.log(this.email.value);
    console.log(this.phone.value);
    console.log(this.industrie.value);
    console.log(this.numberofemployee.value);
    console.log(this.numberofdev.value);
    console.log(this.techno.value);
    console.log(this.videolink.value);
    console.log(this.websitelink.value);
    console.log(this.teaser.value);
    console.log(this.linkedin.value);
    console.log(this.facebook.value);
    console.log(this.twitter.value);
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
    this.uploadimgfirst.nativeElement.src = '';

  }

  public show_header_param() {

    this.paramHeader.nativeElement.classList.toggle('active-param-header');
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
    this.uploadimgLast.nativeElement.src = '';
  }


  readURL(event) {

    if (event.target.files && event.target.files[0]) {

      this.blockUpload = true;
      this.cadrageImgBoolean = true;

      const extensionsAutorise = ['.png', '.gif', '.jpg', '.jpeg', '.PNG', '.GIF', '.JPG', '.JPEG'];
      const extension = this.verifExtension(event.target.value);


      if (extension === extensionsAutorise[0]
        || extension === extensionsAutorise[1] ||
        extension === extensionsAutorise[2] ||
        extension === extensionsAutorise[3] || extension === extensionsAutorise[4] || extension === extensionsAutorise[5] ||
        extension === extensionsAutorise[6] || extension === extensionsAutorise[7]
      ) {

        this.cadrageImgBooleanState = false;

        this.btnValideParent.nativeElement.children[0].disabled = false;

        this.uploadimgfirst.nativeElement.src = URL.createObjectURL(event.target.files[0]);

      } else {

        this.cadrageImgBooleanState = true;
        this.btnValideParent.nativeElement.children[0].disabled = true;

      }


    }

  }

  readURL_deux(event) {


    this.blockUploadLast = true;
    this.cadrageImgBooleanLast = true;

    const extensionsAutorise = ['.png', '.gif', '.jpg', '.jpeg', '.PNG', '.GIF', '.JPG', '.JPEG'];
    const extension = this.verifExtension(event.target.value);

    if (extension === extensionsAutorise[0]
      || extension === extensionsAutorise[1] ||
      extension === extensionsAutorise[2] ||
      extension === extensionsAutorise[3] || extension === extensionsAutorise[4] || extension === extensionsAutorise[5] ||
      extension === extensionsAutorise[6] || extension === extensionsAutorise[7]
    ) {

      this.cadrageImgBooleanStateLast = false;

      this.uploadimgLast.nativeElement.src = URL.createObjectURL(event.target.files[0]);

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
}

