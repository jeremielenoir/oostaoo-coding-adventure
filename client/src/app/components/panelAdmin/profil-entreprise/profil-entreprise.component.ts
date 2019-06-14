import { Component, OnInit, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'app-profil-entreprise',
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.css']
})



export class ProfilEntrepriseComponent implements OnInit {


  public currentValue: number;
  public interval: any;

  shadowModal = null;
  file = null;
  cadrageImg = null;
  uploadImg = null;
  blockUpload = null;
  blockUploadDeux = null;
  btnValide = null;
  btnValideDeux = null;
  textErrorUpload = null;
  imgFigure = null;
  paramHeader = null;
  shadowCogAddImages = null;

  industrie: string[] = ['Communications', 'Game publisher', 'Industry', 'Internet',
    'IT Services', 'Recruiting Agency', 'Security', 'Software', 'Startup', 'Other'];
  nbrEmploye: string[] = ['1-9', '10-49', '50-199', '+200'];

  toppings = new FormControl();
  toppingList: string[] = ['Ada', 'Android', 'Bash', 'Big Data',
    'C', 'C++', 'C#', 'Clojure', 'Cloud', 'Cobol', 'DBA', 'Dart', 'Delphi',
    '.NET', 'F#'];


  constructor() { }

  ngOnInit() {

    this.currentValue = 0;

    this.shadowModal = document.getElementById('shadow-cog');
    this.file = document.getElementById('file');

    this.cadrageImg = document.querySelectorAll('.cadrage-img');
    this.uploadImg = document.querySelectorAll('.uploadImg');
    this.textErrorUpload = document.querySelectorAll('.text-error-upload');
    this.imgFigure = document.querySelectorAll('.img-figure');

    this.blockUpload = document.getElementById('block-upload');

    this.blockUploadDeux = document.getElementById('block-upload-deux');

    this.btnValide = document.getElementById('btn-valide');
    this.btnValideDeux = document.getElementById('btn-valide-deuxx');


    this.paramHeader = document.querySelector('.param-header');

    this.shadowCogAddImages = document.getElementById('shadow-cog-add-images');


  }

  verifExtension(chemin) {
    const longueur = chemin.length;
    const indiceDebut = longueur - 4;
    const indiceFin = longueur;
    const extension = chemin.substr(indiceDebut, indiceFin);

    return extension;

  }


  readURL(event) {

    this.uploadImg[0].src = URL.createObjectURL(event.target.files[0]);

    this.blockUpload.style.display = 'none';

    this.btnValide.disabled = false;
    const extensionsAutorise = ['.png', '.gif', '.jpg', '.jpeg', '.PNG', '.GIF', '.JPG', '.JPEG'];

    const extension = this.verifExtension(event.target.value);

    if (extension === extensionsAutorise[0]
      || extension === extensionsAutorise[1] ||
      extension === extensionsAutorise[2] ||
      extension === extensionsAutorise[3] || extension === extensionsAutorise[4] || extension === extensionsAutorise[5] ||
      extension === extensionsAutorise[6] || extension === extensionsAutorise[7]
    ) {

      this.cadrageImg[0].style.display = 'block';
      this.imgFigure[0].style.display = 'block';
      this.textErrorUpload[0].style.display = 'none';

    } else {

      this.cadrageImg[0].style.display = 'block';
      this.textErrorUpload[0].style.display = 'block';
      this.imgFigure[0].style.display = 'none';

      this.btnValide.disabled = true;

      this.btnValide.disabled = true;

    }

  }



  public modal_upload() {

    this.shadowModal.classList.add('shadow-cog-active');

  }

  public param_cog_non_active() {

    const element = document.getElementById('shadow-cog');

    element.classList.remove('shadow-cog-active');

  }





  public show_header_param() {

    this.paramHeader.classList.toggle('active-param-header');

  }

  // function modal add images

  public param_cog_non_active_add_image() {

    this.shadowCogAddImages.classList.add('shadow-cog-active');

  }

  public param_cog_non_active_add_img() {


    this.shadowCogAddImages.classList.remove('shadow-cog-active');

  }

  readURL_deux(event) {

    this.uploadImg[1].src = URL.createObjectURL(event.target.files[0]);

    this.blockUploadDeux.style.display = 'none';

    this.btnValide.disabled = false;
    const extensionsAutorise = ['.png', '.gif', '.jpg', '.jpeg', '.PNG', '.GIF', '.JPG', '.JPEG'];

    const extension = this.verifExtension(event.target.value);

    if (extension === extensionsAutorise[0]
      || extension === extensionsAutorise[1] ||
      extension === extensionsAutorise[2] ||
      extension === extensionsAutorise[3] || extension === extensionsAutorise[4] || extension === extensionsAutorise[5] ||
      extension === extensionsAutorise[6] || extension === extensionsAutorise[7]
    ) {

      this.cadrageImg[1].style.display = 'block';
      this.imgFigure[1].style.display = 'block';
      this.textErrorUpload[1].style.display = 'none';

    } else {

      this.cadrageImg[1].style.display = 'block';
      this.textErrorUpload[1].style.display = 'block';
      this.imgFigure[1].style.display = 'none';

      this.btnValideDeux.disabled = true;
    }

    this.btnValideDeux.disabled = true;
  }

}