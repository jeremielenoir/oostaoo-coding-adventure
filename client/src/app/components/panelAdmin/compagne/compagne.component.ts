import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiClientService, API_URI_CAMPAIGNS, API_URI_USER } from '../../../api-client/api-client.service';
import { InviteCandidat } from '../edit-campagne/candidats/invite-candidat.component';
import { MatDialog } from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.css']
})
export class CompagneComponent implements OnInit {

  public campaigns = [];
  public searchHeader: string;
  @Output() campaignsChild = new EventEmitter<any>();
  public searchText = '';

  constructor(public apiClientService: ApiClientService, public dialog: MatDialog, public decryptTokenService: DecryptTokenService) {
    this.searchHeader = null;
  }

  ngOnInit() {
    this.getCampaigns();
    console.log(this.decryptTokenService.userId);
    // Observable.of(campaigns)
    // .map(content => JSON.parse(content))
    // .concatMap(arr => Observable.from(arr.data))
    // .filter(user.id => user.id.Type === 5)
    // .subscribe(val => console.log(val))
  }

  getCampaigns(): Promise<any> {
    // return this.apiClientService
    //   .get(API_URI_CAMPAIGNS)
    //   .toPromise()
    //   .then((datas) => {
    //     this.campaigns = datas;
    //     console.log('CAMPAIGNS', this.campaigns);
    //     this.giveCampaigns();
    //   });
       return this.apiClientService.get(API_URI_CAMPAIGNS).toPromise().then(campaigns => {
        for (const campaign of campaigns) {
         if (campaign.user.id === this.decryptTokenService.userId) {
           console.log(campaign);
           this.campaigns.push(campaign);
         }
        }
        this.giveCampaigns();
      }
    );
  }



  openDialog(idCampaign) {
    const inviteCandidatDialog = this.dialog.open(InviteCandidat, {
      data: idCampaign,
      height: '80vh'
    });
    // inviteCandidatDialog.afterClosed().subscribe((data) => {
    //   this.getCampaigns().then(datas => {
    //     console.log('AFTER CLOSE ALL DATAS', datas);
    //   });
    // });
  }

  giveCampaigns() {
    this.campaignsChild.emit(this.campaigns);
  }

}
