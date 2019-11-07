import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-sidibar-right',
  templateUrl: './sidibar-right.component.html',
  styleUrls: ['./sidibar-right.component.scss']
})
export class SidibarRightComponent implements OnInit {
  @Input() campaignsFromParent;
  @ViewChild('option') option: ElementRef;
  @ViewChild('check1') check1: ElementRef;
  @ViewChild('check2') check2: ElementRef;

  public Isactive = false;
  public candidatbydate: Array<any>;
  public myArrayCandidat: any[] = [];
  public optionFilter: string[];

  constructor() { }

  ngOnInit() {

    // console.log('this.campaignsFromParent SIDIBAR: ', this.campaignsFromParent);

    console.log('all campagne', this.campaignsFromParent);
    for (const campaign of this.campaignsFromParent) {
      // console.log('campaigns: ', campaign);
      for (const candidat of campaign.candidats) {
        this.myArrayCandidat.push(candidat);
        console.log('candidat', this.myArrayCandidat)
        this.candidatbydate = this.myArrayCandidat.sort((a, b) => {
          if (a.invitation_date < b.invitation_date) {
            return 1;
          } else if (b.invitation_date < a.invitation_date) {
            return -1;
          } else {
            return 0;
          }
        });
      }
    }
  }



  public param_cog() {

    this.Isactive = true;

  }

  public param_cog_non_active() {

    this.Isactive = false;

  }

  public hundeleSubmit() {

    if (this.check1.nativeElement.checked) {

      this.candidatbydate = this.candidatbydate.filter(element => {
        return element.invitation_date == element.test_terminer;
      })

    } else {
      console.log('pas ok');
      this.candidatbydate = this.myArrayCandidat;
    }


    // if (this.check2.nativeElement.checked) {

    //   this.candidatbydate = this.candidatbydate.filter(element => {
    //     return element.invitation_date == element.test_terminer;
    //   })

    // } else {
    //   console.log('pas ok');
    //   this.candidatbydate = this.myArrayCandidat;
    // }



  }

}
