import { Component, OnInit, QueryList, ViewChild, ViewEncapsulation } from "@angular/core";
import {FormControl} from '@angular/forms';



@Component({
  selector: 'app-profil-entreprise',
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.css']
})



export class ProfilEntrepriseComponent implements OnInit {


  public currentValue: number;
  public interval: any;

  shadow_modal = null;
  file = null;
  cadrage_img = null
  upload_img = null
  block_upload = null
  block_upload_deux = null
  btn_valide = null
  btn_valide_deux = null
  text_error_upload = null;
  img_figure = null;
  param_header = null;
  shadow_cog_add_images = null

  industrie: string[] = ["Communications","Game publisher","Industry","Internet","IT Services","Recruiting Agency","Security","Software","Startup","Other"];
  nbr_employe: string[] = ["1-9","10-49","50-199","+200"]

  toppings = new FormControl();
  toppingList: string[] = ['Ada', 'Android', 'Bash', 'Big Data', 'C', 'C++','C#','Clojure','Cloud','Cobol','DBA','Dart','Delphi','.NET','F#'];


  constructor() { }

  ngOnInit() {

  

    this.currentValue = 0;

    this.shadow_modal = document.getElementById('shadow-cog')
    this.file = document.getElementById('file');

    this.cadrage_img = document.querySelectorAll('.cadrage-img');
    this.upload_img = document.querySelectorAll('.upload_img');
    this.text_error_upload = document.querySelectorAll('.text-error-upload');
    this.img_figure = document.querySelectorAll('.img-figure');

    this.block_upload = document.getElementById('block-upload');
    
    this.block_upload_deux = document.getElementById('block-upload-deux');

    this.btn_valide = document.getElementById('btn-valide');
    this.btn_valide_deux = document.getElementById('btn-valide-deuxx');


    this.param_header = document.querySelector('.param-header');

    this.shadow_cog_add_images = document.getElementById('shadow-cog-add-images')


  }

   verifExtension(chemin)
  {
      let longueur = chemin.length;
      let indice_debut = longueur - 4;
      let indice_fin = longueur; 
      let extension = chemin.substr(indice_debut,indice_fin);

      return extension;
   
  }

  
readURL(event) {

  this.upload_img[0].src = URL.createObjectURL(event.target.files[0]);

  this.block_upload.style.display = "none"

  this.btn_valide.disabled = false;
  let extensions_autorise  = [".png",".gif",".jpg",".jpeg",'.PNG','.GIF','.JPG','.JPEG'];

  let extension = this.verifExtension(event.target.value)

  if(extension == extensions_autorise[0] 
    || extension == extensions_autorise[1] || 
    extension == extensions_autorise[2] || 
    extension == extensions_autorise[3] || extension == extensions_autorise[4] || extension == extensions_autorise[5] ||
    extension == extensions_autorise[6] || extension == extensions_autorise[7]
     ){

      this.cadrage_img[0].style.display = "block"; 
      this.img_figure[0].style.display = "block";
      this.text_error_upload[0].style.display = "none"

  }else{
    
    this.cadrage_img[0].style.display = "block";
    this.text_error_upload[0].style.display = "block";
    this.img_figure[0].style.display = "none";

    this.btn_valide.disabled = true;

  }

}



  public modal_upload(){

    this.shadow_modal.classList.add('shadow-cog-active')

  }

  public param_cog_non_active(){

    let element = document.getElementById('shadow-cog');

    element.classList.remove('shadow-cog-active')

  }





public show_header_param(){

  this.param_header.classList.toggle('active-param-header')

}

// function modal add images

public param_cog_non_active_add_image(){

  this.shadow_cog_add_images.classList.add('shadow-cog-active')

}

public param_cog_non_active_add_img(){


    this.shadow_cog_add_images.classList.remove('shadow-cog-active')

}

readURL_deux(event) {

  this.upload_img[1].src = URL.createObjectURL(event.target.files[0]);

  this.block_upload_deux.style.display = "none"

  this.btn_valide.disabled = false;
  let extensions_autorise  = [".png",".gif",".jpg",".jpeg",'.PNG','.GIF','.JPG','.JPEG'];

  let extension = this.verifExtension(event.target.value)

  if(extension == extensions_autorise[0] 
    || extension == extensions_autorise[1] || 
    extension == extensions_autorise[2] || 
    extension == extensions_autorise[3] || extension == extensions_autorise[4] || extension == extensions_autorise[5] ||
    extension == extensions_autorise[6] || extension == extensions_autorise[7]
     ){

      this.cadrage_img[1].style.display = "block"; 
      this.img_figure[1].style.display = "block";
      this.text_error_upload[1].style.display = "none"

  }else{
    
    this.cadrage_img[1].style.display = "block";
    this.text_error_upload[1].style.display = "block";
    this.img_figure[1].style.display = "none";

    this.btn_valide_deux.disabled = true;
  }

}




}


