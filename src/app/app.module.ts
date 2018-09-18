import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { ConfigurationMicroService } from './shared/configuration-micro.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { FxroomComponent } from './fxroom/fxroom.component';

import 'hammerjs';
import 'hammer-timejs';
import { PopupboxComponent } from './popupbox/popupbox.component';
//Route Paths
const routes: Routes = [
  { path: '', redirectTo: 'feedback', pathMatch: 'full' },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'fxroom', component: FxroomComponent },
  
  { path: '**', redirectTo: 'feedback' }
];

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
    FxroomComponent,
    PopupboxComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    FormsModule,
    HttpModule
  ],
  exports: [RouterModule],
  providers: [ConfigurationMicroService],
  bootstrap: [AppComponent]
})
export class AppModule { }
