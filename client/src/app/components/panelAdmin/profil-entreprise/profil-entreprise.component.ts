import { Component, OnInit, QueryList, ViewChild, ElementRef} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profil-entreprise',
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.css']
})

export class ProfilEntrepriseComponent implements OnInit {

  @ViewChild('paramHeader') paramHeader: ElementRef;
  @ViewChild('uploadimgfirst') uploadimgfirst: ElementRef;
  @ViewChild('uploadimgLast') uploadimgLast: ElementRef;
  @ViewChild('btnValideParent') btnValideParent: ElementRef;
  @ViewChild('btnValideParentAddImage') btnValideParentAddImage:ElementRef;


  public currentValue: number;
  public interval: any;
  public shadowcog = false;
  public shadowcogImage = false;
  public cadrageImgBoolean = false;
  public blockUpload = false;
  public cadrageImgBooleanState = false;
  public blockUploadLast = false;
  public cadrageImgBooleanLast = false;
  public cadrageImgBooleanStateLast = false;


  industrie: string[] = ['Communications', 'Game publisher', 'Industry', 'Internet',
    'IT Services', 'Recruiting Agency', 'Security', 'Software', 'Startup', 'Other'];
  nbrEmploye: string[] = ['1-9', '10-49', '50-199', '+200'];

  toppings = new FormControl();
  toppingList: string[] = ['Ada', 'Android', 'Bash', 'Big Data',
    'C', 'C++', 'C#', 'Clojure', 'Cloud', 'Cobol', 'DBA', 'Dart', 'Delphi',
    '.NET', 'F#'];

  constructor() { }

  ngOnInit() {


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


  param_cog_non_active_add_image(){

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
}