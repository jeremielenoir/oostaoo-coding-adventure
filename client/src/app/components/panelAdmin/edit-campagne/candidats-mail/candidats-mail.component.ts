import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS,
  API_URI_USER
} from '../../../../api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { Router } from '@angular/router';

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

  nbCandidatsError: string = null;
  noMoreTestError: string = null;

  public offer_id: any;
  public tests_available: any;
  public user_id: any;

  constructor(private router: Router,
    @Inject(MAT_DIALOG_DATA) public data,
    public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CandidatsMailComponent>,
  ) {
    this.candidats = this.data.contact;
    let count = 0;
    for (const iterator of this.data.contact) {
      count++;
    }
    this.nbCandidat = count;
  }

  ngOnInit() {

    this.user_id = this.decryptTokenService.userId;
    this.offer_id = this.decryptTokenService.offer_id;

// get the user's tests_available via API instead of localStorage because of
// decryptTokenService's bug with localStorage updated values
      this.apiClientService
        .get(`${API_URI_USER}/${this.user_id}`)
        .subscribe(datas => {
          this.tests_available = datas.tests_available;
          console.log('NGONINIT / this.tests_available: ', this.tests_available);
        });



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

  goToSubscribe(){
    this.dialog.closeAll();
    this.router.navigate(['/subscription']);
  }

  updateCampaignPostCandidats() {
    if(this.tests_available == -1){
        for (const iterator of this.candidats) {
          this.postCandidat(iterator.name, iterator.value);
        }

    }else if (this.offer_id == 14){
        this.goToSubscribe();

    } else if(this.tests_available == 0){
      setTimeout(()=>{
        this.goToSubscribe();
      }, 1500)
      this.noMoreTestError = `Vous n'avez plus de test disponible`;

    }else if(this.nbCandidat > this.tests_available ){
        setTimeout(()=>{
          this.retourCandidat();
        }, 1500);
        this.nbCandidatsError = `Impossible d'inviter ${this.nbCandidat} candidat${this.nbCandidat>1?'s':''}. Il vous reste seulement ${this.tests_available} test${this.tests_available>1?'s':''} disponible${this.tests_available>1?'s':''}`;

    } else {
      this.tests_available = this.tests_available - this.nbCandidat;
      this.apiClientService
        .put(`${API_URI_USER}/${this.user_id}`,{
          tests_available: this.tests_available
        })
        .toPromise()
        .then(async(res)=>{
          localStorage.setItem('currentUser', res.newToken);
          for (const iterator of this.candidats) {
          this.postCandidat(iterator.name, iterator.value);
          }
        },
        err => console.log(err)
      );
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
        // to get the new localStorage value of tests_available with DecryptTokenService in nginit cycle
        window.location.reload();

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
