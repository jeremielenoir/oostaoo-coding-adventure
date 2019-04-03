import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from './material';
import { NavbarMaterialComponent } from './navbar-material/navbar-material.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TestanimComponent } from './testanim/testanim.component';
import { CounterAnimComponent } from './counter-anim/counter-anim.component';
import {IndexPageComponent} from './index-page/index-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavbarMaterialComponent,
    TestanimComponent,
    CounterAnimComponent,
    IndexPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
