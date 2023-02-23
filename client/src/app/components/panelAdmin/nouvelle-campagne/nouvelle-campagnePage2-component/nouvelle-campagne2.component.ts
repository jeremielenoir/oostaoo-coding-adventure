import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { AuthenticationService } from 'src/app/components/home/register/service/auth.service';
import { Observable, Subscription } from 'rxjs';
import {
  ApiClientService,
  API_URI_CAMPAIGNS
} from 'src/app/api-client/api-client.service';
 

@Component({
  selector: 'app-NouvelleCampagnePage2Component',
  templateUrl: './nouvelle-campagne2.component.html',
  styleUrls: [
    './nouvelle-campagne2.component.scss',
    '../nouvelle-campagne.component.scss'
  ]
})
export class NouvelleCampagnePage2Component implements OnInit {
  selectedLangue = 'FR';

  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public errorNomCampgane = false;
  
  public errorName: string;
  private subscription: Subscription;
  public campaigns = [];
  public nameFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(public apiClientService: ApiClientService,
              public decryptTokenService: DecryptTokenService,
              public authenticationService: AuthenticationService,) 
    {
              

    }

  ngOnInit() {
    this.formCampagne.patchValue({
      nomDeCampagne:
        this.formCampagne.value.role +
        ' - ' +
        this.formCampagne.value.experience
    });

    const adminId: number = this.decryptTokenService.adminId || this.decryptTokenService.userId;
    this.subscription = this.authenticationService.getCampaignsUser(adminId).subscribe((campaigns: Record<string, any>[]) => {
    this.campaigns = campaigns;
    });
  }

  postData() {
    this.formCampagne.patchValue({
      utilisationCopieColler: this.formCampagne.value.utilisationCopieColler,
      envoiRapportSimplifie: this.formCampagne.value.envoiRapportSimplifie,
      langue: this.selectedLangue
    });
  }

  
  public onDecrementPage(): void {
    this.decrementPage.emit(); // Déclenche l'output
  }

  public onIncrementPage(pDatafromValue): void {
  
  if(this.formCampagne.controls.nomDeCampagne.hasError('required') == false &&
      this.formCampagne.controls.nomDeCampagne.hasError('forbiddenName') == false){
        this.incrementPage.emit(); 
        console.log("toto");
        console.log((this.formCampagne.controls.nomDeCampagne.hasError('forbiddenName')));
        console.log("tata");
      
      // Déclenche l'output pour passer à la paga suivante.
    }
  }
}
