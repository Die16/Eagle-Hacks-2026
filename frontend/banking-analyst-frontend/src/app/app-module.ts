import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ClientIntakeForm } from './client-intake-form/client-intake-form';
import { Dashboard } from './dashboard/dashboard';

//Module dependency for intake form
import { ReactiveFormsModule } from '@angular/forms';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [App, ClientIntakeForm, Dashboard],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, CommonModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [App],
})
export class AppModule {}
