import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidibar-right',
  templateUrl: './sidibar-right.component.html',
  styleUrls: ['./sidibar-right.component.css']
})
export class SidibarRightComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public param_cog(){

    let element = document.getElementById('shadow-cog');
    element.classList.add('shadow-cog-active')

  }

  public param_cog_non_active(){

    let element = document.getElementById('shadow-cog');

    element.classList.remove('shadow-cog-active')

  }

}
