import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss']
})
export class SidibarRightComponent implements OnInit {
  @Input() campaignsFromParent;
  @Output() IsBoaleanSmallSidibarOutput = new EventEmitter<boolean>()

  @ViewChild('option') option: ElementRef;
  @ViewChild('check1') check1: ElementRef;
  @ViewChild('check2') check2: ElementRef;


  public Isactive = false;
  public isActiveNotiFinish = false;
  public isActiveNotifInvite = false;
  public IsBoaleanSmallSidibar: boolean;
  public candidatbydate: Array<any> = [];
  public candidatByFinish: Array<any> = [];
  public candidatAll: Array<any> = [];
  public storageRecuperationCheck: any

  public myArrayCandidat: any[] = [];
  public optionFilter: string[];
  public testCheck: any;
  constructor() { }

  ngOnInit() {

    for (const campaign of this.campaignsFromParent) {
      for (const candidat of campaign.candidats) {
        this.myArrayCandidat.push(candidat);
        // console.log("coucou " + this.myArrayCandidat);
        this.candidatbydate = this.myArrayCandidat.sort((a, b) => {
          if (a.test_terminer < b.test_terminer) {
            // console.log("A " + a.test_terminer + " B " + b.test_terminer)
            return 1;
          } else if (b.test_terminer < a.test_terminer) {
            return -1;
          } else {
            return 0;
          }
        });
      }
    }

    //session storage

    if (localStorage.getItem('notification') === undefined || localStorage.getItem('notification') === null) {
      // console.log('cest null ton truc');
      this.check1.nativeElement.checked = true;
      this.check2.nativeElement.checked = true;
      localStorage.setItem('notification', JSON.stringify(this.allCheckevent()));
    } else {
      this.storageRecuperationCheck = localStorage.getItem('notification');
      this.storageRecuperationCheck = JSON.parse(this.storageRecuperationCheck);
      this.check1.nativeElement.checked = this.storageRecuperationCheck.valueCheckeventFirst;
      this.check2.nativeElement.checked = this.storageRecuperationCheck.valueCheckeventLast;
    }

    this.saveCheckValue();
    // this.finishedTest();

  }

  // public finishedTest() {
  //   this.myArrayCandidat.forEach(finished => {
  //     if(finished.duree !== null) {
  //       this.candidatByFinish.push(finished);
  //       console.log("candidatfinish " + this.candidatByFinish);
  //     }
  //     console.log("finished " + finished)
  //   })


  // }


  public sidibar_small_modele() {
    console.log('Hellow word');
    this.IsBoaleanSmallSidibar = !this.IsBoaleanSmallSidibar;
    this.IsBoaleanSmallSidibarOutput.emit(this.IsBoaleanSmallSidibar);
  }

  public allCheckevent() {
    return {
      valueCheckeventFirst: this.check1.nativeElement.checked,
      valueCheckeventLast: this.check2.nativeElement.checked,
    }

  }


  public param_cog() {

    this.Isactive = true;

  }

  public param_cog_non_active() {

    this.Isactive = false;

    this.check1.nativeElement.checked = this.storageRecuperationCheck.valueCheckeventFirst;
    this.check2.nativeElement.checked = this.storageRecuperationCheck.valueCheckeventLast;
  }

  public saveCheckValue() {

    console.log('salut les gens')

    if (!this.check1.nativeElement.checked && !this.check2.nativeElement.checked) {

      this.candidatbydate = [];

    }

    if (this.check1.nativeElement.checked && this.check2.nativeElement.checked) {
      if (this.candidatbydate.length === 0) {
        this.candidatbydate = this.myArrayCandidat
      }
      this.isActiveNotiFinish = false;
      this.isActiveNotifInvite = false

    } else {


      if (this.check1.nativeElement.checked) {

        if (this.candidatbydate.length === 0) {
          this.candidatbydate = this.myArrayCandidat
        }

        this.isActiveNotifInvite = true;
        this.isActiveNotiFinish = false;

      }

      if (this.check2.nativeElement.checked) {
        if (this.candidatbydate.length === 0) {
          this.candidatbydate = this.myArrayCandidat
        }

        this.isActiveNotiFinish = true;
        this.isActiveNotifInvite = false;

        console.log('salut')

      }

    }
  }


  public hundeleSubmit() {


    localStorage.setItem('notification', JSON.stringify(this.allCheckevent()));

    this.saveCheckValue()

    this.Isactive = false;

  }

}
