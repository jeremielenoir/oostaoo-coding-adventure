import { Component, OnInit } from '@angular/core';
import { AgWordCloudData } from 'angular4-word-cloud';

@Component({
  selector: 'app-second-section',
  templateUrl: './second-section.component.html',
  styleUrls: ['./second-section.component.scss']
})
export class SecondSectionComponent implements OnInit {

  // Create Work Cloud Data Array
    wordData: Array<AgWordCloudData> = [
      {size: 400, text: 'Développeur Backend Nodejs'},
      {size: 301, text: 'Devops'},
      {size: 123, text: 'Expert AWS'},
      {size: 321, text: 'Développeur React'},
      {size: 231, text: 'Développeur Angular'},
      {size: 123, text: 'Développeur Frontend'},
      {size: 346, text: 'Architecte Logiciel'},
      {size: 107, text: 'Lead Tech'},
      {size: 436, text: 'Lead Developer'},
      {size: 731, text: 'SCRUM MASTER'},
      {size: 80, text: 'Développeur Vuejs'},
      {size: 96, text: 'Ingénieur développement JAVA'},
      {size: 531, text: 'libero'},
      {size: 109, text: 'nisl'},
      {size: 972, text: 'odio'},
      {size: 213, text: 'tincidunt'},
      {size: 294, text: 'vulputate'},
      {size: 472, text: 'venenatis'},
      {size: 297, text: 'malesuada'},
      {size: 456, text: 'finibus'},
      {size: 123, text: 'tempor'},
      {size: 376, text: 'tortor'},
      {size: 93, text: 'congue'},
      {size: 123, text: 'possit'},
  ];
    // Word Cloud Options
    options = {
        settings: {
            minFontSize: 15,
            maxFontSize: 90
        },
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        labels: false // false to hide hover labels
    };

  constructor() { }

  ngOnInit() {
  }

}
