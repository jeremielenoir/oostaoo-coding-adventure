import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidibar-right',
  templateUrl: './sidibar-right.component.html',
  styleUrls: ['./sidibar-right.component.css']
})
export class SidibarRightComponent implements OnInit {
  @Input() campaignsFromParent;
  public Isactive = false;
  public candidats: Array<any>;

  constructor() { }

  ngOnInit() {
    // console.log('this.campaignsFromParent SIDIBAR: ', this.campaignsFromParent);
    const myArrayCandidat = [];
    for (const campaign of this.campaignsFromParent) {
      // console.log('campaigns: ', campaign);
      for (const candidat of campaign.candidats) {
        console.log('candidat', candidat);
        myArrayCandidat.push(candidat);
        this.candidats = myArrayCandidat;
      }
    }
  }

  public param_cog() {

    this.Isactive = true;

  }

  public param_cog_non_active() {

    this.Isactive = false;

  }

}
