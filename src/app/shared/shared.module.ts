import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToolbarComponent } from '../app-toolbar/app-toolbar.component';
import { RouterModule } from '@angular/router';
import { 
  MatIconModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule
  ],
  declarations: [
    AppToolbarComponent
  ],
  exports: [
    AppToolbarComponent
  ]
})
export class SharedModule { }
