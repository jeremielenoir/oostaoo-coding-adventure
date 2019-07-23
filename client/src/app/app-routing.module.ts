import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilComponent } from './components/home/accueil/accueil.component';
import { NouvelleCampagneComponent } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagne.component';
import { RouteComponentComponent2 } from './components/panelAdmin/route-component2/route-component.component';
import { ProfilUtilisateurComponent } from './components/panelAdmin/profil-utilisateur/profil-utilisateur.component';
import { ProtectionDeDonneesComponent } from './components/panelAdmin/protection-de-donnees/protection-de-donnees.component';
import { FacturationComponent } from './components/panelAdmin/facturation/facturation.component';
import { UtilisateursComponent } from './components/panelAdmin/compte-utilisateurs/utilisateurs.component';
import { ProfilEntrepriseComponent } from './components/panelAdmin/profil-entreprise/profil-entreprise.component';
import { EditCampagneComponent } from './components/panelAdmin/edit-campagne/edit-campagne.component';
import { CandidatsComponent } from './components/panelAdmin/edit-campagne/candidats/candidats.component';
import { QuestionsComponent } from './components/panelAdmin/edit-campagne/questions/questions.component';
import { SettingsComponent } from './components/panelAdmin/edit-campagne/settings/settings.component';
import { GeneralComponent } from './components/panelAdmin/edit-campagne/settings/general/general.component';
import { PersonnalisationComponent } from './components/panelAdmin/edit-campagne/settings/personnalisation/personnalisation.component';
import { ClientTestComponent } from './components/panelAdmin/client-test/client-test.component';
import { TestComponent } from './components/panelAdmin/client-test/test/test.component';

const routes: Routes = [
  {
    path: 'evaluate',
    component: ClientTestComponent
  },
  {
    path: 'evaluate/testing',
    component: TestComponent
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: AccueilComponent
  },
  {
    path: 'dashboard',
    redirectTo: 'dashboard/campaigns',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/campaigns',
    component: RouteComponentComponent2
  },
  {
    path: 'dashboard/campaigns/new',
    component: NouvelleCampagneComponent
  },
  {
    path: 'dashboard/campaigns/:id',
    component: EditCampagneComponent,
    children: [
      { path: 'candidats', component: CandidatsComponent },
      { path: 'questions', component: QuestionsComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'general' },
          { path: 'general', component: GeneralComponent },
          { path: 'personnalisation', component: PersonnalisationComponent }
        ]
      }
    ]
  },

  {
    path: 'dashboard/profil-utilisateur',
    component: ProfilUtilisateurComponent
  },
  {
    path: 'dashboard/profil-entreprise',
    component: ProfilEntrepriseComponent
  },
  {
    path: 'dashboard/facturation',
    component: FacturationComponent
  },
  {
    path: 'dashboard/protection-des-donnees',
    component: ProtectionDeDonneesComponent
  },
  {
    path: 'dashboard/utilisateurs',
    component: UtilisateursComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
