import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./navbar/navbar.component";
import { MaterialModule } from "./material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TestanimComponent } from "./testanim/testanim.component";
import { IndexPageComponent } from "./index-page/index-page.component";
import { SecondSectionComponent } from "./second-section/second-section.component";
import { CounterAnimComponent } from "./counter-anim/counter-anim.component";
import { FooterComponent } from "./footer/footer.component";
import { CountUpModule } from "countup.js-angular2";
import { MainComponent } from "./main/main.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TestanimComponent,
    IndexPageComponent,
    SecondSectionComponent,
    CounterAnimComponent,
    MainComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CountUpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
