import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalDataModule } from './Shared/global-data/global-data.module';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { TopNavBarComponent } from './Components/Layout/top-nav-bar/top-nav-bar.component';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  
  
  constructor(private router:Router,
    private global:GlobalDataModule,
    private http:HttpClient,
    //public app:AppComponent
    // private menu:TopNavBarComponent
    ){
      this.moduleID = localStorage.getItem('mid');

    
  }

   curComponent:any;
   moduleID:any;


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
    
   if(this.global.glbMenulist != ''){
    

    
  //  console.log(this.global.Menulist);
    this.curComponent =  this.global.glbMenulist.find((e:any)=>e.menuLink == route.url[0].path.toString());
    
    // console.log(this.curComponent);
    
    if(this.curComponent != undefined){ 
     
            return true;      
          }else{
            // this.router.navigate(['main/'+Response[0].pageLink]);
            this.global.logout();
            return false;
          }

   }else{
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.moduleID).subscribe(
      (Response:any)=>{
   
       
    
        this.curComponent =  Response.find((e:any)=>e.menuLink == route.url[0].path.toString());
        
        if(this.curComponent != undefined){
       
     
          return true;      
        }else{
          this.router.navigate(['home']);
          // this.global.logout();
          return false;
        }
        
        
        
      }
    )

   }
    return true;
    

      
    
  }

  
  
  





  
}
