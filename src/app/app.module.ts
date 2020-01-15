import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptors/interceptor.service';
import { MaterialModule } from './material/angular-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { DatePipe } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { AuthGuardService } from './services/auth-Guard/auth-guard.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CampaignDescriptionComponent } from './modules/modals/campaign-description/campaign-description.component';
import { UpdateCampaignComponent } from './modules/modals/update-campaign/update-campaign.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignDescriptionComponent,
    UpdateCampaignComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    TextMaskModule,
    AngularEditorModule,
  ],
  providers: [
    [AppConfig],
    [DatePipe],
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    Title
  ],
  entryComponents: [
    CampaignDescriptionComponent,
    UpdateCampaignComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
