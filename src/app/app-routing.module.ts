import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './Components/Layout/main/main.component';
import { HomeComponent } from './Components/home/home.component';



export const routes: Routes= [
  {path:'login', component:LoginComponent },
  {
    path: 'home',
    component: MainComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  {path:'acc', 
  component:MainComponent,
  loadChildren:()=> 
  import('./Components/Accounts/accounts.module').then((m)=>m.AccountsModule),
 
},
{ path: '**', redirectTo: 'login', pathMatch: 'full' },
 

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  
  exports: [RouterModule,
   ]
})
export class AppRoutingModule { }