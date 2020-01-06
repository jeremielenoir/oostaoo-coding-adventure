import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiClientService } from './api-client/api-client.service';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CountUpModule } from 'countup.js-angular2';
import { DragScrollModule } from 'ngx-drag-scroll';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// import components
import { NavbarComponent } from './components/home/navbar/navbar.component';
import { IndexPageComponent } from './components/home/index-page/index-page.component';
import { SecondSectionComponent } from './components/home/second-section/second-section.component';
import { CounterAnimComponent } from './components/home/counter-anim/counter-anim.component';
import { FooterComponent } from './components/home/footer/footer.component';

import { MainComponent } from './components/home/main/main.component';
import { SliderComponent } from './components/home/slider/slider.component';

import { SlideMarquesComponent } from './components/home/slide-marques/slide-marques.component';
import { RouteComponentComponent, DistConnecTed } from './components/panelAdmin/navbar/route-component.component';
import { AccueilComponent } from './components/home/accueil/accueil.component';

import { NavMobileAbsoluteDirective } from './directives/nav-mobile-absolute.directive';
import { IntegrationBoutonComponent } from './components/panelAdmin/integration-bouton/integration-bouton.component';
import { NouvelleCampagneComponent } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagne.component';
import {
  NouvelleCampagnePage1Component
} from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage1-component/nouvelle-campagne.component';
import {
  NouvelleCampagnePage2Component
} from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage2-component/nouvelle-campagne2.component';
import {
  NouvelleCampagnePage3Component, PopupCampaign
} from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage3-component/nouvelle-campagne3.component';

import { DashboadCampagneComponent } from './components/panelAdmin/dashboard-campagne/dashboard-campagne.component';
import { CampagneComponent, DialogOverviewDelete, DialogOverviewDuplicate } from './components/panelAdmin/campagne/campagne.component';
import { SidibarRightComponent } from './components/panelAdmin/sidebar-right/sidebar-right.component';
import { DatePipe } from '@angular/common';
import { ProfilUtilisateurComponent } from './components/panelAdmin/profil-utilisateur/profil-utilisateur.component';
import { ProtectionDeDonneesComponent } from './components/panelAdmin/protection-de-donnees/protection-de-donnees.component';
import { FacturationComponent } from './components/panelAdmin/facturation/facturation.component';
import { UtilisateursComponent } from './components/panelAdmin/compte-utilisateurs/utilisateurs.component';
import { ProfilEntrepriseComponent } from './components/panelAdmin/profil-entreprise/profil-entreprise.component';
import { EditCampagneComponent } from './components/panelAdmin/edit-campagne/edit-campagne.component';
import { CandidatsComponent } from './components/panelAdmin/edit-campagne/candidats/candidats.component';
import { InviteCandidat } from './components/panelAdmin/edit-campagne/candidats/invite-candidat.component';
import { OrderModule } from 'ngx-order-pipe';

import { QuestionsComponent } from './components/panelAdmin/edit-campagne/questions/questions.component';
import { SettingsComponent } from './components/panelAdmin/edit-campagne/settings/settings.component';
import { CandidatsFormComponent } from './components/panelAdmin/edit-campagne/candidats-form/candidats-form.component';
import { CandidatsMailComponent } from './components/panelAdmin/edit-campagne/candidats-mail/candidats-mail.component';
import { GeneralComponent } from './components/panelAdmin/edit-campagne/settings/general/general.component';
import { PersonnalisationComponent } from './components/panelAdmin/edit-campagne/settings/personnalisation/personnalisation.component';
import { ClientTestComponent } from './components/panelAdmin/client-test/client-test.component';
import { TestComponent } from './components/panelAdmin/client-test/test/test.component';

import { NgxEditorModule } from 'ngx-editor';
import { NotFoundComponent } from './components/panelAdmin/not-found/not-found.component';
import { BreadcrumbComponent } from './components/panelAdmin/breadcrumb/breadcrumb.component';
import { RegisterComponent } from './components/home/register/register.component';
// import { DecryptTokenService } from './components/home/register/register.service';
import { BlockCopyPasteDirective } from './components/panelAdmin/client-test/block-copy-paste.directive';
import { FinTestComponent } from './components/panelAdmin/client-test/fin-test/fin-test.component';
import { JwtInterceptor } from './components/home/register/service/jwt.interceptor';
import { ErrorInterceptor } from './components/home/register/service/error.interceptor';
import { DecryptTokenService } from './components/home/register/register.service';
import { TechnoComponent } from './components/home/techno/techno.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { OffersComponent } from './components/home/offers/offers.component';


@NgModule({
  // [RouteComponentComponent, PopupMonOffre, InviteCandidat, CandidatsComponent, PopupCampaign,
  //   NouvelleCampagnePage3Component, CandidatsMailComponent],
  entryComponents: [RouteComponentComponent, DistConnecTed, InviteCandidat, CandidatsComponent, PopupCampaign,
    NouvelleCampagnePage3Component, CandidatsMailComponent,  DialogOverviewDelete, DialogOverviewDuplicate],
  declarations: [
    AppComponent,
    NavbarComponent,
    IndexPageComponent,
    SecondSectionComponent,
    CounterAnimComponent,
    MainComponent,
    FooterComponent,
    SliderComponent,
    SlideMarquesComponent,
    RouteComponentComponent,
    DistConnecTed,
    // PopupMonOffre,
    AccueilComponent,
    NavMobileAbsoluteDirective,
    IntegrationBoutonComponent,
    NouvelleCampagneComponent,
    NouvelleCampagnePage1Component,
    NouvelleCampagnePage2Component,
    PopupCampaign,
    NouvelleCampagnePage3Component,
    DashboadCampagneComponent,
    CampagneComponent,
    DialogOverviewDelete,
    DialogOverviewDuplicate,
    SidibarRightComponent,
    ProfilUtilisateurComponent,
    FacturationComponent,
    ProtectionDeDonneesComponent,
    UtilisateursComponent,
    ProfilEntrepriseComponent,
    EditCampagneComponent,
    CandidatsComponent,
    InviteCandidat,
    QuestionsComponent,
    SettingsComponent,
    CandidatsFormComponent,
    CandidatsMailComponent,
    GeneralComponent,
    PersonnalisationComponent,
    ClientTestComponent,
    TestComponent,
    NotFoundComponent,
    BreadcrumbComponent,
    RegisterComponent,
    BlockCopyPasteDirective,
    FinTestComponent,
    TechnoComponent,
    OffersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CountUpModule,
    DragScrollModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    RoundProgressModule,
    NgxEditorModule,
    OrderModule,
    ScrollToModule.forRoot()
  ],
  providers: [
    ApiClientService,
    DatePipe,
    DecryptTokenService,
    CampagneComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
