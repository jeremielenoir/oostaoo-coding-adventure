import { Component, OnInit } from '@angular/core';
import { ApiClientService, API_URI_USER } from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';

@Component({
  selector: 'app-protection-de-donnees',
  templateUrl: './protection-de-donnees.component.html',
  styleUrls: ['./protection-de-donnees.component.scss']
})
export class ProtectionDeDonneesComponent implements OnInit {

  public user: any;
  public email: string;

  dataRoute: any;
  constructor(public apiClientService: ApiClientService, public decryptTokenService: DecryptTokenService) { }

  ngOnInit() {
    this.dataRoute = [
      { routerLink: '/subscription', condition: true, classAnimParent: 'hvr-icon-bounce', classAnimIcone: 'hvr-icon', icon: 'credit_card', name: 'Abonnement' },
      { routerLink: '/dashboard/facturation', condition: true, classAnimParent: 'hvr-icon-bounce', classAnimIcone: 'hvr-icon', icon: 'list_alt', name: 'Facturation' },
      { routerLink: '/dashboard/protection-des-donnees', condition: true, classAnimParent: 'hvr-icon-bounce', classAnimIcone: 'hvr-icon', icon: 'admin_panel_settings', name: 'Confidentialité' }
    ];
    this.getUser().then(user => {
      this.email = (user[0].email);
    });
  }

  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER + '/' + this.decryptTokenService.userId)
        .toPromise();
      return this.user = [datas];
    } catch (err) {
      return err;
    }
  }

}
