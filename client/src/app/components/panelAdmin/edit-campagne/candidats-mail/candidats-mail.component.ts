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

  public sujet = 'Évaluation technique';
  public name:string[] = [];
  public contenu: string;

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

        for(let candidat of this.candidats){

          this.name.push(candidat.name)

      }        

       this.contenu = `

       Bonjour ${this.name},


      Votre candidature a retenu notre attention.
    
        Dans le cadre de notre processus de recrutement, nous avons le plaisir de
        vous inviter à passer une évaluation technique. Vous pourrez choisir le
        moment le plus approprié pour vous pour passer ce test.
  
        Quand vous serez prêt(e), cliquez sur le lien ci-dessous pour accéder à la
        page d’accueil de votre session : "LINK INVITATION"
    

      Bonne chance !


        Cordialement
    
    `;

  }
  postCandidat(nom, emailContact): Promise<any> {
    return this.apiClientService.post(API_URI_CANDIDATS, {
      Nom: nom,
      email: emailContact,
      token: this.data.globalId
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
      candidats: idCandidat,
      email_title: this.sujet,
      email_content: this.contenu
    }).toPromise()
      .then((res) => {
        console.log('CANDIDATS', res);
        this.dialog.closeAll();
      },
        err => console.log(err)
      );
  }

  retourCandidat() {
    this.dialogRef.close();
  }

  showCandidats() {
    console.log(this.candidats);
  }
}
