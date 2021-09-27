import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilComponent } from './components/home/accueil/accueil.component';
import { MainLayoutComponent } from './main-layout.component';
import { NouvelleCampagneComponent } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagne.component';
import { DashboadCampagneComponent } from './components/panelAdmin/dashboard-campagne/dashboard-campagne.component';
import { ProfilUtilisateurComponent } from './components/panelAdmin/profil-utilisateur/profil-utilisateur.component';
import { ProtectionDeDonneesComponent } from './components/panelAdmin/protection-de-donnees/protection-de-donnees.component';
import { FacturationComponent } from './components/panelAdmin/facturation/facturation.component';
import { UtilisateursComponent } from './components/panelAdmin/compte-utilisateurs/utilisateurs.component';
import { ProfilEntrepriseComponent } from './components/panelAdmin/profil-entreprise/profil-entreprise.component';
import { EditCampagneComponent } from './components/panelAdmin/edit-campagne/edit-campagne.component';
import { CandidatsComponent } from './components/panelAdmin/edit-campagne/candidats/candidats.component';
import { EditQuestionsComponent } from './components/panelAdmin/edit-campagne/edit-questions/edit-questions.component';
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
import { AlgotestComponent } from './components/panelAdmin/algotest/algotest.component';
import { ContactUsComponent } from './components/home/contact-us/contact-us.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { CreditcardComponent } from './components/creditcard/creditcard.component';
import { SaveCardComponent } from './components/save-card/save-card.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: AccueilComponent,
  },
  {
    path: 'questions',
    component: QuestionsComponent,
  },
  {
    path: 'algo',
    component: AlgotestComponent,
  },
  {
    path: 'evaluate',
    component: ClientTestComponent,
  },
  {
    path: 'about',
    component: AboutUsComponent,
  },
  {
    path: 'contact',
    component: ContactUsComponent,
  },
  {
    path: 'home/rapport_exemple',
    component: RapportDetailleExempleComponent,
  },
  {
    path: 'home/register',
    component: RegisterComponent,
  },
  {
    path: 'home/register/mot-de-passe-oublie',
    component: MotDePasseOublieComponent,
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payment',
    component: StripePaymentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'save-payment',
    component: SaveCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    redirectTo: 'dashboard/campaigns',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [
      {
        path: 'campaigns',
        component: DashboadCampagneComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'campaigns/new',
        component: NouvelleCampagneComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'campaigns/:id',
        component: EditCampagneComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'candidats/:idCandidat/rapport-detaille',
            component: RapportDetailleComponent,
          },
          { path: 'candidats', component: CandidatsComponent },
          { path: 'questions', component: EditQuestionsComponent },
          {
            path: 'settings',
            component: SettingsComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'general' },
              { path: 'general', component: GeneralComponent },
              {
                path: 'personnalisation',
                component: PersonnalisationComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'profil-utilisateur',
        component: ProfilUtilisateurComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profil-entreprise',
        component: ProfilEntrepriseComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'facturation',
        component: FacturationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'protection-des-donnees',
        component: ProtectionDeDonneesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'utilisateurs',
        component: UtilisateursComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'contact-support',
        component: ContactSupportComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'dashboard/faq',
    component: FAQComponent,
  },
  {
    path: 'dashboard/faq/:dynamicParams',
    component: FAQComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class AppRoutingModule {}
