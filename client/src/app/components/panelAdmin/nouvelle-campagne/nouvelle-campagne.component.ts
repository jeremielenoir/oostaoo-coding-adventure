import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

//import { campaigns } from 'src/app/components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage2-component/nouvelle-campagne2.component';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { AuthenticationService } from 'src/app/components/home/register/service/auth.service';
import { Observable, Subscription } from 'rxjs';
import {
  ApiClientService,
  API_URI_CAMPAIGNS
} from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-nouvelle-campagne',
  templateUrl: './nouvelle-campagne.component.html',
  styleUrls: ['./nouvelle-campagne.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NouvelleCampagneComponent implements OnInit {
  nNumeorPage: number;
  ParentFormCampagne: FormGroup;
  technoFromChild: Array<string>;
  selectProfilFromChild: string;
  public Alltechno: any[] = [];
  public campaigns = [];
  private subscription: Subscription;
  public forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let forbidden = false;
      this.campaigns.forEach((element)=> {
        if (control.value === element.Name) {
            forbidden = true;
        } 
      });
      return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
  }






  constructor(private formBuilder: FormBuilder,
              public apiClientService: ApiClientService,
              public decryptTokenService: DecryptTokenService,
              public authenticationService: AuthenticationService,) {
    this.nNumeorPage = 1;
  
    this.ParentFormCampagne = this.formBuilder.group({
      role: ['',Validators.required],
      roleSelectedId: { id: '' },
      techno: [[],Validators.required],
      technoSelectedId: [],
      experience: ['facile',Validators.required],
      utilisationCopieColler: 'false',
      envoiRapportSimplifie: 'false',
      nomDeCampagne: ['',[Validators.required, this.forbiddenNameValidator()]],
      langue: [],
      CampaignID: { id: '' }
    });
  }

  

  ngOnInit() {
    const adminId: number = this.decryptTokenService.adminId || this.decryptTokenService.userId;
    this.subscription = this.authenticationService.getCampaignsUser(adminId).subscribe((campaigns: Record<string, any>[]) => {
    this.campaigns = campaigns;
    });
  }

 

  getTechno(techno: Array<string>) {
    return (this.technoFromChild = techno);
  }

  getProfil(profil: string) {
    return (this.selectProfilFromChild = profil);
  }

  showtechno() {
    console.log('this.technoFromChild: ', this.technoFromChild);
  }

  public nextPage(): void {
    this.nNumeorPage++;
  }

  public previousPage(): void {
    console.log(this.ParentFormCampagne.value);
    this.nNumeorPage--;
  }

  public nouvelleCampagne(p_oDataFormValue: any): void {
    console.log(p_oDataFormValue);
  }

  public recupeAllTechno(event) {
    this.Alltechno = [...event];
    console.log('this.Alltechno', this.Alltechno);
  }
}
