import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

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
import { RouteComponentComponent } from './components/panelAdmin/route-component/route-component.component';
import { AccueilComponent } from './components/home/accueil/accueil.component';



const appRoutes: Routes = [
  {
    path: 'campaings',
    component: RouteComponentComponent
  },
  {
    path: '',
    component: AccueilComponent
  }
]

@NgModule({
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
    AccueilComponent
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
    DragScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
