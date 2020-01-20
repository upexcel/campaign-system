import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComposeEmailRoutingModule } from './compose-email-routing.module';
import { ComposeEmailComponent } from './compose-email.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [ComposeEmailComponent],
  imports: [
    CommonModule,
    ComposeEmailRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    AngularEditorModule,
  ],
  exports: [
    AngularEditorModule
  ]
})
export class ComposeEmailModule { }
