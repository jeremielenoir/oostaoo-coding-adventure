import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  currentMenuId = "menuRoodeo";
  currentSection = "home";
  constructor() {
    
   }

  ngOnInit() {
  }

  setCurrentSection(id: string){
    console.log('ID', id);
    this.currentSection = id;
  }

}
