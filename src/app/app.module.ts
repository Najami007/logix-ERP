import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { ToastrModule } from 'ngx-toastr';
// import { FilterPipe } from './Shared/pipes/filter.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoginComponent } from './login/login.component';

import { Subject } from 'rxjs/internal/Subject';
import { GlobalDataModule } from './Shared/global-data/global-data.module';

import { HttpClientModule } from '@angular/common/http';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from './Shared/material/material.module';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationService } from './Shared/service/notification.service';
import { HomeComponent } from './Components/home/home.component';
import { COAComponent } from './Components/Accounts/coa/coa.component';
import { MainComponent } from './Components/Layout/main/main.component';
import { TopNavBarComponent } from './Components/Layout/top-nav-bar/top-nav-bar.component';
import { HeaderComponent } from './Components/Layout/header/header.component';











@NgModule({
  declarations: [   
    AppComponent, 
    LoginComponent,
    HomeComponent,
    COAComponent,
    MainComponent,
    TopNavBarComponent,
    HeaderComponent,


    // FilterPipe,
    
  ],
  imports: [
    ChartModule,  
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ToastrModule.forRoot(), 
    Ng2SearchPipeModule,
    GlobalDataModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    NgxPaginationModule
   
    
  

  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] }, NotificationService,GlobalDataModule],
  bootstrap: [AppComponent]
})
export class AppModule { 


}
