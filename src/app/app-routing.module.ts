import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './Components/Layout/main/main.component';
import { HomeComponent } from './Components/home/home.component';



export const routes: Route[]= [
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
{path:'user', 
component:MainComponent,
loadChildren:()=> 
import('./Components/User/user.module').then((m)=>m.UserModule),

},
{path:'cmp', 
component:MainComponent,
loadChildren:()=> 
import('./Components/Company/company.module').then((m)=>m.CompanyModule),

},
{path:'inv', 
component:MainComponent,
loadChildren:()=> 
import('./Components/Inventory/inventory.module').then((m)=>m.InventoryModule),

},
{ path: '**', redirectTo: 'login', pathMatch: 'full' },
 

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  
  exports: [RouterModule,
   ]
})
export class AppRoutingModule { }