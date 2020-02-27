import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS
} from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-candidats-mail',
  templateUrl: './candidats-mail.component.html',
  styleUrls: ['./candidats-mail.component.scss']
})
export class CandidatsMailComponent implements OnInit {
  public campaigns: any;
  public candidats: any;
  public nbCandidat: number;

  public sujet: string;
  public name: string[] = [];
  public contenu: string;
  public show = false;
  public htmlContent: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public apiClientService: ApiClientService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CandidatsMailComponent>
  ) {
    this.candidats = this.data.contact;
    let count = 0;
    for (const iterator of this.data.contact) {
      count++;
    }
    this.nbCandidat = count;
  }

  ngOnInit() {

    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.data.globalId)
      .subscribe(datas => {
        this.campaigns = [datas];
      });

    for (const candidat of this.candidats) {

      this.name.push(candidat.name);

    }
    this.sujet = 'Évaluation technique';

    this.htmlContent = `
       <div><span style="background-color: transparent; font-size: 1rem;">Bonjour ${this.name},</span><br>
       </div><div><span style="background-color: transparent; font-size: 1rem;"><br></span></div>
       <div>Votre candidature a retenu notre attention.</div><div>Dans le cadre de notre processus
       de recrutement,nous avons le plaisir de vous inviter à passer une évaluation technique.</div>
       <div>Vous pourrez choisir le moment le plus approprié pour vous pour passer ce test.</div>
       <div>Quand vous serez prêt(e), cliquez sur le lien ci-dessous pour accéder à la page d’accueil de votre session :&nbsp;
       <a href="http://${window.location.host}/evaluate/..." target="_blank" style="font-size: 1rem;">
       http://${window.location.host}/evaluate/...</a></div>
       <div><br></div><div><br></div>
       <div>Bonne chance !</div><div>Cordialement </div>
    `;

    // this.sujet = this.campaigns[0].email_title;

    // this.contenu = `

    // Bonjour ${this.name}

    //     ${this.campaigns[0].email_content}
    //   `;
  }

  postCandidat(nom, emailContact): Promise<any> {
    return this.apiClientService.post(API_URI_CANDIDATS, {
      Nom: nom,
      email: emailContact,
      idCampaign: this.data.globalId,
      email_title: this.sujet,
      email_content: this.htmlContent,
      name_candidats: this.name
    }).toPromise()
      .then(
        res => {
          console.log('res', res.id);
          const idCandidat = [];
          idCandidat.push(res.id);
          this.openSnackBar('Le candidat a bien été invité', 'Fermer');
          return idCandidat;
        }, err => {
          console.log('log error', err)
        }
      )
      .then(idCandidat => {
        this.updateCampaign(idCandidat);
      });
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 3000,
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
      email_content: this.htmlContent
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
