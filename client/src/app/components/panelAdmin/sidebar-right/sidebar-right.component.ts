import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss']
})
export class SidebarRightComponent implements OnInit, OnChanges {
  @Input() campaignsFromParent;
  @Output() IsBoaleanSmallSidebarOutput = new EventEmitter<boolean>()

  @ViewChild('option') option: ElementRef;
  @ViewChild('check1') check1: ElementRef;
  @ViewChild('check2') check2: ElementRef;


  public Isactive = false;
  public isActiveNotiFinish = false;
  public isActiveNotifInvite = false;
  public IsBoaleanSmallSidebar: boolean;
  public candidatbydate: Array<any> = [];
  public candidatByFinish: Array<any> = [];
  public candidatAll: Array<any> = [];
  public storageRecuperationCheck: any;

  public myArrayCandidat: any[] = [];
  public optionFilter: string[];
  public testCheck: any;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit() {

    this.myArrayCandidat = [];
    if (this.campaignsFromParent) {
      for (const campaign of this.campaignsFromParent) {
        for (const candidat of campaign.candidats) {

          this.myArrayCandidat.push(candidat);

          this.candidatbydate = this.myArrayCandidat.sort((a, b) => {
            if (a.test_terminer < b.test_terminer) {
              return 1;
            } else if (b.test_terminer < a.test_terminer) {
              return -1;
            } else {
              return 0;
            }
          });
        }
      }
    }

    //session storage

    if (localStorage.getItem('notification') === undefined || localStorage.getItem('notification') === null) {
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

  }

  public sidebar_small_modele() {
    this.IsBoaleanSmallSidebar = !this.IsBoaleanSmallSidebar;
    this.IsBoaleanSmallSidebarOutput.emit(this.IsBoaleanSmallSidebar);
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


      }

    }
  }


  public hundeleSubmit() {


    localStorage.setItem('notification', JSON.stringify(this.allCheckevent()));

    this.saveCheckValue()

    this.Isactive = false;

  }

}
