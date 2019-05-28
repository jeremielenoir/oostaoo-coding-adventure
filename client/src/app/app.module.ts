import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import {RoundProgressModule} from 'angular-svg-round-progressbar';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./components/home/navbar/navbar.component";
import { MaterialModule } from "./material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { IndexPageComponent } from "./components/home/index-page/index-page.component";
import { SecondSectionComponent } from "./components/home/second-section/second-section.component";
import { CounterAnimComponent } from "./components/home/counter-anim/counter-anim.component";
import { FooterComponent } from "./components/home/footer/footer.component";
import { CountUpModule } from "countup.js-angular2";
import { MainComponent } from "./components/home/main/main.component";
import { SliderComponent } from "./components/home/slider/slider.component";
import { DragScrollModule } from "ngx-drag-scroll";
import { SlideMarquesComponent } from "./components/home/slide-marques/slide-marques.component";
import { RouteComponentComponent, PopupMonOffre } from './components/panelAdmin/navbar/route-component.component';
import { AccueilComponent } from './components/home/accueil/accueil.component';
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material';
import { NavMobileAbsoluteDirective } from './directives/nav-mobile-absolute.directive';
import { EditQuestionComponent, nouvelleQuestion } from './components/panelAdmin/edit-question/edit-question.component';


import { IntegrationBoutonComponent } from './components/panelAdmin/integration-bouton/integration-bouton.component';
import { NouvelleCampagneComponent } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagne.component';
import { NouvelleCampagnePage1Component } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage1-component/nouvelle-campagne.component';
import { NouvelleCampagnePage2Component } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage2-component/nouvelle-campagne2.component';
import { NouvelleCampagnePage3Component, PopupCampaign } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage3-component/nouvelle-campagne3.component';

import { RouteComponentComponent2 } from './components/panelAdmin/route-component2/route-component.component';
import { CompagneComponent } from './components/panelAdmin/compagne/compagne.component';
import { SidibarRightComponent } from './components/panelAdmin/sidibar-right/sidibar-right.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ProfilUtilisateurComponent } from './components/panelAdmin/profil-utilisateur/profil-utilisateur.component';
import { ProtectionDeDonneesComponent } from './components/panelAdmin/protection-de-donnees/protection-de-donnees.component';
import { FacturationComponent } from './components/panelAdmin/facturation/facturation.component';
import { UtilisateursComponent } from './components/panelAdmin/compte-utilisateurs/utilisateurs.component';
import { ProfilEntrepriseComponent } from './components/panelAdmin/profil-entreprise/profil-entreprise.component';

import { HttpClientModule } from '@angular/common/http';


const appRoutes: Routes = [
  // {
  //   path: 'editquestion',
  //   component: EditQuestionComponent
  // },
  {
    path: '',
    component: AccueilComponent
  },
  // {
  //   path: 'dashboard',
  //   component: RouteComponentComponent
  // },
  {
    path: 'dashboard/campaigns',
    component: IntegrationBoutonComponent,
  },
  {
    path: 'dashboard/campaigns/new',
    component: NouvelleCampagneComponent,
  },
  {
    path: 'dashboard/profil-utilisateur',
    component: ProfilUtilisateurComponent,
  },
  {
    path: 'dashboard/profil-entreprise',
    component: ProfilEntrepriseComponent,
  },
  {
    path: 'dashboard/facturation',
    component: FacturationComponent,
  },
  {
    path: 'dashboard/protection-des-donnees',
    component: ProtectionDeDonneesComponent,
  },
  {
    path: 'dashboard/utilisateurs',
    component: UtilisateursComponent,
  },
  // {
  //   path: 'test2',
  //   component: NouvelleCampagnePage3Component
  // },
  {
    path: 'dashboard',
    component: RouteComponentComponent2
  }
]

@NgModule({
  entryComponents: [RouteComponentComponent, PopupMonOffre, nouvelleQuestion, EditQuestionComponent, PopupCampaign, NouvelleCampagnePage3Component],
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
    PopupMonOffre,
    AccueilComponent,
    NavMobileAbsoluteDirective,
    EditQuestionComponent,
    nouvelleQuestion,
    IntegrationBoutonComponent,
    NouvelleCampagneComponent,
    NouvelleCampagnePage1Component,
    NouvelleCampagnePage2Component,
    PopupCampaign,
    NouvelleCampagnePage3Component,
    RouteComponentComponent2,
    CompagneComponent,
    SidibarRightComponent,
    ProfilUtilisateurComponent,
    FacturationComponent,
    ProtectionDeDonneesComponent,
    UtilisateursComponent,
    ProfilEntrepriseComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CountUpModule,
    DragScrollModule,
    MatBottomSheetModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    RoundProgressModule
  ],
  providers: [{ provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
