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
import { OffersComponent } from './components/home/offers/offers.component';
import { StripePaymentComponent } from './components/home/stripe-payment/stripe-payment.component';
import { RapportDetailleComponent } from './components/panelAdmin/edit-campagne/candidats/rapport-detaille/rapport-detaille.component';
import { RapportDetailleExempleComponent } from './components/home/rapport-detaille/rapport-detaille.component';
import { MotDePasseOublieComponent } from './components/home/register/mot-de-passe-oublie/mot-de-passe-oublie.component';
import { SubscriptionComponent } from './components/panelAdmin/subscription/subscription.component';
import { FAQComponent } from './components/panelAdmin/FAQ/faq.component';
import { ContactSupportComponent } from './components/panelAdmin/contact-support/contact-support.component';
import { AboutUsComponent } from './components/home/about-us/about-us.component';
import { AlgoComponent } from './components/panelAdmin/algo/algo.component';
import { ContactFormularComponent } from './components/panelAdmin/contact-support/contact-formular/contact-formular.component'

const routes: Routes = [

  {
    path: 'algo',
    component: AlgoComponent
  },
  {
    path: 'evaluate',
    component: ClientTestComponent
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'about',
    component: AboutUsComponent
  },
  {
    path: 'contact',
    component: ContactFormularComponent
  },
  {
    path: 'home',
    component: AccueilComponent
  },
  {
    path: 'home/rapport_exemple',
    component: RapportDetailleExempleComponent
  },
  {
    path: 'home/register',
    component: RegisterComponent
  },
  {
    path: 'home/register/mot-de-passe-oublie',
    component: MotDePasseOublieComponent
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    component: StripePaymentComponent,
    canActivate: [AuthGuard]
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
      { path: 'candidats/:idCandidat/rapport-detaille', component: RapportDetailleComponent },
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
    path: 'dashboard/contact-support',
    component: ContactSupportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: 'dashboard/faq',
    component: FAQComponent
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
