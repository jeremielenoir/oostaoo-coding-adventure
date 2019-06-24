import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidibar-right',
  templateUrl: './sidibar-right.component.html',
  styleUrls: ['./sidibar-right.component.css']
})
export class SidibarRightComponent implements OnInit {

  public Isactive = false;

  constructor() { }

  ngOnInit() {
  }

  public param_cog(){

    this.Isactive = true;

  }

  public param_cog_non_active(){
 
    this.Isactive = false;

  }

}
