import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { CookieService } from 'ngx-cookie-service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ApiClientService } from './api-client/api-client.service';
import { AuthenticationService } from './components/home/register/service/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { CountUpModule } from 'countup.js-angular2';
import { DragScrollModule } from 'ngx-drag-scroll';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

// import components
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './main-layout.component';
import { NavbarComponent } from './components/home/navbar/navbar.component';
import { IndexPageComponent } from './components/home/index-page/index-page.component';
import { SecondSectionComponent } from './components/home/second-section/second-section.component';
import { CounterAnimComponent } from './components/home/counter-anim/counter-anim.component';
import { FooterComponent } from './components/home/footer/footer.component';
import { BaseButton } from './components/common/ui/buttons/base-button.component';
import { BaseHeaderPanel } from './components/common/ui/header-panel/base-header-panel.component';
import { MediaQueryComponent } from './components/common/ui/media-query/media-query.component';

import { InterviewComponent } from './components/home/interview/interview.component';
import { SliderComponent } from './components/home/slider/slider.component';

import { SlideMarquesComponent } from './components/home/slide-marques/slide-marques.component';
import {
  RouteComponentComponent,
  DistConnecTed
} from './components/panelAdmin/navbar/route-component.component';

import { CarouselComponent, CarouselItemElement } from './components/home/carousel/carousel.component';
import { CarouselItemDirective } from './components/home/carousel/carousel-item.directive';
import { AccueilComponent } from './components/home/accueil/accueil.component';

import { NavMobileAbsoluteDirective } from './directives/nav-mobile-absolute.directive';
import { ScrollPointDirective } from './directives/scrollpoint.directive';

import { IntegrationBoutonComponent } from './components/panelAdmin/integration-bouton/integration-bouton.component';
import { NouvelleCampagneComponent } from './components/panelAdmin/nouvelle-campagne/nouvelle-campagne.component';
import {
  NouvelleCampagnePage1Component
} from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage1-component/nouvelle-campagne.component';
import {
  NouvelleCampagnePage2Component
} from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage2-component/nouvelle-campagne2.component';
import {
  NouvelleCampagnePage3Component,
  PopupCampaign
} from './components/panelAdmin/nouvelle-campagne/nouvelle-campagnePage3-component/nouvelle-campagne3.component';
import { DashboadCampagneComponent } from './components/panelAdmin/dashboard-campagne/dashboard-campagne.component';
import {
  CampagneComponent,
  DialogOverviewDelete,
  DialogOverviewDuplicate,
  CampaignsArchivedPipe
} from './components/panelAdmin/campagne/campagne.component';
import { SidebarRightComponent } from './components/panelAdmin/sidebar-right/sidebar-right.component';
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

import { EditQuestionsComponent } from './components/panelAdmin/edit-campagne/edit-questions/edit-questions.component';
import { SettingsComponent } from './components/panelAdmin/edit-campagne/settings/settings.component';
import { CandidatsFormComponent } from './components/panelAdmin/edit-campagne/candidats-form/candidats-form.component';
import { CandidatsMailComponent } from './components/panelAdmin/edit-campagne/candidats-mail/candidats-mail.component';
import { GeneralComponent } from './components/panelAdmin/edit-campagne/settings/general/general.component';
import { PersonnalisationComponent } from './components/panelAdmin/edit-campagne/settings/personnalisation/personnalisation.component';
import { ClientTestComponent } from './components/panelAdmin/client-test/client-test.component';
import { TestComponent } from './components/panelAdmin/client-test/test/test.component';
import { DialogTimeoutComponent} from './components/panelAdmin/client-test/test/dialog-timeout.component'



// import { NgxEditorModule } from 'ngx-editor';
import { NotFoundComponent } from './components/panelAdmin/not-found/not-found.component';
import { BreadcrumbComponent } from './components/panelAdmin/breadcrumb/breadcrumb.component';
import {
  RegisterComponent,
  DialogForgetPassword
} from './components/home/register/register.component';
// import { DecryptTokenService } from './components/home/register/register.service';
import { BlockCopyPasteDirective } from './components/panelAdmin/client-test/block-copy-paste.directive';
import { FinTestComponent } from './components/panelAdmin/client-test/fin-test/fin-test.component';
import { JwtInterceptor } from './components/home/register/service/jwt.interceptor';
import { ErrorInterceptor } from './components/home/register/service/error.interceptor';
import { DecryptTokenService } from './components/home/register/register.service';
import { TechnoComponent } from './components/home/techno/techno.component';
import { ProfilesComponent } from './components/home/profiles/profiles.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { OffersComponent } from './components/home/offers/offers.component';
import { HomeOffersComponent } from './components/home/home-offers/home-offers.component';
import {
  RapportDetailleHomeComponent,
  RapportDetailleExempleComponent
} from './components/home/rapport-detaille/rapport-detaille.component';
import { SelectedLanguageService } from './services/selected-language.service';
import { FonctionnaliteComponent } from './components/home/fonctionnalite/fonctionnalite.component';
import { StripePaymentComponent } from './components/home/stripe-payment/stripe-payment.component';
import { RapportDetailleComponent } from './components/panelAdmin/edit-campagne/candidats/rapport-detaille/rapport-detaille.component';
// https://www.npmjs.com/package/ngx-stripe
import { NgxStripeModule } from 'ngx-stripe';
import { RatingFeedbackComponent } from './components/panelAdmin/client-test/fin-test/rating-feedback/rating-feedback.component';
import { DragNDropComponent, DialogOverviewTestComponent } from './components/panelAdmin/dragndrop/dragndrop.component';
import { ResponseFormatedComponent } from './components/panelAdmin/dragndrop/response-formated.component';
import { TopInfoCampagneComponent } from './components/panelAdmin/top-info-campagne/top-info-campagne.component';
import { MotDePasseOublieComponent } from './components/home/register/mot-de-passe-oublie/mot-de-passe-oublie.component';
import { SubscriptionComponent } from './components/panelAdmin/subscription/subscription.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { FAQComponent } from './components/panelAdmin/FAQ/faq.component';
import { ContactSupportComponent } from './components/panelAdmin/contact-support/contact-support.component';
import { AboutUsComponent } from './components/home/about-us/about-us.component';
import { AlgoComponent } from './components/panelAdmin/questions-type/algo-type/algo.component';
import { ContactFormularComponent } from './components/panelAdmin/contact-support/contact-formular/contact-formular.component';
import { ContactJoinUsComponent } from './components/panelAdmin/contact-support/contact-join-us/contact-join-us.component';
import { AlgotestComponent } from './components/panelAdmin/algotest/algotest.component';
import { ContactUsComponent } from './components/home/contact-us/contact-us.component';
import { TypeFaqPipe } from './components/panelAdmin/FAQ/faq.pipes';
import { AboutTeamComponent } from './components/home/about-us/about-team/about-team.component';
import { QuestionsTypeComponent } from './components/panelAdmin/questions-type/questions-type.component';
import { OneTypeComponent } from './components/panelAdmin/questions-type/one-type/one-type.component';
import { FreeTypeComponent } from './components/panelAdmin/questions-type/free-type/free-type.component';
import { MultipleTypeComponent } from './components/panelAdmin/questions-type/multiple-type/multiple-type.component';
import { ConfirmComponent } from './components/home/confirm/confirm.component';
import { SearchPipe } from './pipe/search.pipe';
import { AddressComponent } from './components/address/address.component';
import { CreditcardComponent } from './components/creditcard/creditcard.component';
import { ContactComponent } from './components/contact/contact.component';
import { MatProgressBarModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { QuestionsComponent } from './components/questions/questions.component';
import { TimeagoComponent } from './components/timeago/timeago.component';
import { InterviewDialogComponent } from './components/panelAdmin/edit-campagne/candidats/interview-dialog/interview-dialog.component';

// nav-wrapper
import { NavWrapperComponent } from './components/panelAdmin/navbar/nav-wrapper/nav-wrapper.component';
import { SaveCardComponent } from './components/save-card/save-card.component';
import { CompactBtnComponent } from './components/common/ui/compact-btn/compact-btn.component';
import { JsonService } from './services/json/json.service';

export class MyIntl extends TimeagoIntl {

}

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  // [RouteComponentComponent, PopupMonOffre, InviteCandidat, CandidatsComponent, PopupCampaign,
  //   NouvelleCampagnePage3Component, CandidatsMailComponent],
  entryComponents: [
    RouteComponentComponent,
    DistConnecTed,
    InviteCandidat,
    CandidatsComponent,
    PopupCampaign,
    NouvelleCampagnePage3Component,
    CandidatsMailComponent,
    DialogOverviewDelete,
    DialogOverviewDuplicate,
    DialogOverviewTestComponent,
    DialogTimeoutComponent,
    InterviewDialogComponent,
    DialogForgetPassword,
    OffersComponent,
    ConfirmComponent,
    AddressComponent,
  ],
  declarations: [
    AppComponent,
    MainLayoutComponent,
    NavbarComponent,
    IndexPageComponent,
    SecondSectionComponent,
    CounterAnimComponent,
    InterviewComponent,
    FooterComponent,
    BaseButton,
    BaseHeaderPanel,
    MediaQueryComponent,
    SliderComponent,
    SlideMarquesComponent,
    RouteComponentComponent,
    DistConnecTed,
    // PopupMonOffre,
    InterviewDialogComponent,
    AccueilComponent,
    NavMobileAbsoluteDirective,
    ScrollPointDirective,
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
    SidebarRightComponent,
    ProfilUtilisateurComponent,
    FacturationComponent,
    ProtectionDeDonneesComponent,
    UtilisateursComponent,
    ProfilEntrepriseComponent,
    EditCampagneComponent,
    CandidatsComponent,
    InviteCandidat,
    EditQuestionsComponent,
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
    DialogForgetPassword,
    BlockCopyPasteDirective,
    FinTestComponent,
    TechnoComponent,
    ProfilesComponent,
    OffersComponent,
    HomeOffersComponent,
    ConfirmComponent,
    RapportDetailleHomeComponent,
    RapportDetailleExempleComponent,
    RapportDetailleComponent,
    FonctionnaliteComponent,
    StripePaymentComponent,
    RatingFeedbackComponent,
    DragNDropComponent,
    ResponseFormatedComponent,
    DialogOverviewTestComponent,
    DialogTimeoutComponent,
    TopInfoCampagneComponent,
    MotDePasseOublieComponent,
    SubscriptionComponent,
    FAQComponent,
    ContactSupportComponent,
    AboutUsComponent,
    AlgoComponent,
    ContactFormularComponent,
    ContactJoinUsComponent,
    AlgotestComponent,
    AlgoComponent,
    CarouselComponent,
    CarouselItemDirective,
    CarouselItemElement,
    ContactUsComponent,
    TypeFaqPipe,
    AboutTeamComponent,
    QuestionsTypeComponent,
    OneTypeComponent,
    FreeTypeComponent,
    MultipleTypeComponent,
    SearchPipe,
    AddressComponent,
    CreditcardComponent,
    ContactComponent,
    QuestionsComponent,
    TimeagoComponent,
    CampaignsArchivedPipe,
    NavWrapperComponent,
    SaveCardComponent,
    MediaQueryComponent,
    CompactBtnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CountUpModule,
    DragScrollModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    RoundProgressModule,
    OrderModule,
    ScrollToModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_jwK67X7FA3xfM8g4GxegZEVe00xbYkFsPq'),
    NgxCaptchaModule,
    MarkdownModule.forRoot(),
    MonacoEditorModule.forRoot(),

    MatDatepickerModule,
    MatNativeDateModule,

    TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: {
        provide: TimeagoFormatter,
        useClass: TimeagoCustomFormatter,
      },
    }),

    CKEditorModule,
    MatProgressBarModule,
    SwiperModule,
  ],
  providers: [
    ApiClientService,
    DatePipe,
    DecryptTokenService,
    CampagneComponent,
    SelectedLanguageService,
    CookieService,
    CampaignsArchivedPipe,
    JsonService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
