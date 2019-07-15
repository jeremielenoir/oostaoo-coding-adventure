import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS
} from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-candidats-mail',
  templateUrl: './candidats-mail.component.html',
  styleUrls: ['./candidats-mail.component.css']
})
export class CandidatsMailComponent implements OnInit {
  public campaigns: any;
  public candidats: any;
  public nbCandidat: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public apiClientService: ApiClientService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<CandidatsMailComponent>) {
                this.candidats = this.data.contact;
                let count = 0;
                for (const iterator of this.data.contact) {
                  count++;
                }
                this.nbCandidat = count;
                console.log('DATA', this.data);
}

  ngOnInit() {
    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.data.globalId)
      .subscribe(datas => {
        this.campaigns = [datas];
      });
  }
  postCandidat(nom, emailContact): Promise<any> {
    return this.apiClientService.post(API_URI_CANDIDATS, {
      Nom: nom,
      email: emailContact,
    }).toPromise()
      .then(
      (res) => {
        console.log('res', res.id);
        const idCandidat = [];
        idCandidat.push(res.id);
        return idCandidat;
      },
      err => console.log(err)
    ).then(idCandidat => {
      this.updateCampaign(idCandidat);
    });
  }

  updateCampaignPostCandidats() {
    for (const iterator of this.candidats) {
      console.log('iterator: ', iterator);
      this.postCandidat(iterator.name, iterator.value);
    }
  }

  updateCampaign(idCandidat): Promise<any> {
    return this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.data.globalId, {
      candidats: idCandidat
    }).toPromise()
    .then((res) => {
        console.log('CANDIDATS', res);
        this.dialog.closeAll();
      },
      err => console.log(err)
    );
  }

  retourCandidat() {
    this.dialogRef.close('tetet');
  }

  showCandidats() {
    console.log(this.candidats);
  }
}
