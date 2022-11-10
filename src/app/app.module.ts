import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage.component'
import {Routes, RouterModule} from '@angular/router'
import {HttpClientModule} from '@angular/common/http'
import { FoodService } from './services/FoodService';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MaterialModule } from './material.module';
import { FoodFormMenuComponent } from './components/food.form.menu.component';
import { DatePipe } from '@angular/common';
import { FoodMenuListComponent } from './components/food.menu.list.component';
import { FoodFormMenuItemComponent } from './components/food.form.menu.item.component';
import { FoodReviewListComponent } from './components/food.review.list.component';
import { FoodReviewFormComponent } from './components/food.review.form.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { FoodMenuListUserComponent } from './components/food.menu.list.user.component';
import { FoodNutritionComponent } from './components/food.nutrition.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { LoginComponent } from './components/login.component';
import { CreateUserComponent } from './components/create.user.component';
import { DialogOverviewExampleDialog, FoodReviewListUserComponent } from './components/food.review.list.user.component';
import { FoodStatisticsComponent } from './components/food.statistics.component';
import { NgxEchartsModule } from 'ngx-echarts';
import {NgxChartsModule} from '@swimlane/ngx-charts'

const appRoutes: Routes = [
  {path: 'home', component: HomepageComponent},
  {path: 'setMenu', component: FoodFormMenuComponent},
  {path: 'menuList', component: FoodMenuListComponent},
  {path: 'editItem', component: FoodFormMenuItemComponent},
  {path: 'reviews/:id', component: FoodReviewListComponent},
  {path: 'meals', component: FoodReviewListUserComponent},
  {path: 'menu', component: FoodMenuListUserComponent},
  {path: 'nutrition', component: FoodNutritionComponent},
  {path: '', component: LoginComponent},
  {path: 'createAccount', component: CreateUserComponent},
  {path: 'statistics', component: FoodStatisticsComponent},
  {path: '**', pathMatch: 'full', redirectTo: '/'}
]

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    FoodFormMenuComponent,
    FoodMenuListComponent,
    FoodFormMenuItemComponent,
    FoodReviewListComponent,
    FoodReviewFormComponent,
    FoodMenuListUserComponent,
    FoodNutritionComponent,
    LoginComponent,
    CreateUserComponent,
    FoodReviewListUserComponent,
    DialogOverviewExampleDialog,
    FoodStatisticsComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes, {useHash: true, onSameUrlNavigation: 'reload'}), HttpClientModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule, MaterialModule, NgxMatFileInputModule, NgxChartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }), NgxEchartsModule.forRoot({
      echarts: () => import('echarts')})
  ],
  providers: [FoodService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
