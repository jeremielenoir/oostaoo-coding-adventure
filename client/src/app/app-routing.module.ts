import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilComponent } from './components/home/accueil/accueil.component';
import { NouvelleCampagneComponent } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagne.component';
import { DashboadCampagneComponent } from './components/panelAdmin/dashboard-campagne/dashboard-campagne.component';
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
import { NotFoundComponent } from './components/panelAdmin/not-found/not-found.component';
import { RegisterComponent } from './components/home/register/register.component';
import { AuthGuard } from '../app/components/home/register/guard/auth.guard';
import { JwtInterceptor } from './components/home/register/service/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './components/home/register/service/error.interceptor';

const routes: Routes = [
  {
    path: 'evaluate',
    component: ClientTestComponent
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: AccueilComponent
  },
  {
    path: 'home/register',
    component: RegisterComponent
  },
  {
    path: 'connect/github/callback',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    redirectTo: 'dashboard/campaigns',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/campaigns',
    component: DashboadCampagneComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'dashboard/campaigns/new',
    component: NouvelleCampagneComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/campaigns/:id',
    component: EditCampagneComponent,
    canActivate: [AuthGuard],
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
    component: ProfilUtilisateurComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/profil-entreprise',
    component: ProfilEntrepriseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/facturation',
    component: FacturationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/protection-des-donnees',
    component: ProtectionDeDonneesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/utilisateurs',
    component: UtilisateursComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }]
})
export class AppRoutingModule { }
