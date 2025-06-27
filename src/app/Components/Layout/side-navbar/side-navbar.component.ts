import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { MainComponent } from '../main/main.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent {

  clickEventSubscription: Subscription ;

  public  menuList?:any = [];
  moduleID?: string | null;



  constructor( 
    private msg:NotificationService,
    private http:HttpClient,
    private route:Router,
    private dialogue:MatDialog,
    private app:AppComponent,
    private m :MainComponent,
    private global:GlobalDataModule
  ){

    this.clickEventSubscription = this.global
    .getMenuItem()
    .subscribe((value: any) => {
      this.moduleID = value;
      this.getMenu();
     
    });
  }
  ngOnInit(): void {
    this.moduleID = localStorage.getItem('mid');
    this.getMenu();
   

  }


  dropDownIcon='arrow_drop_up';

 
  expandDiv = false;
  Expanded =  false;


  collapseAccounts(){
    this.expandDiv = !this.expandDiv;
    if(this.expandDiv == true){
      this.dropDownIcon = 'arrow_drop_down';
    }else{
      this.dropDownIcon ='arrow_drop_up';
    }
  }



  
  getMenu(){
 
    if (this.moduleID != null &&
      (typeof this.moduleID == 'string' || typeof this.moduleID == 'number')
    ){


      this.http.get(environment.mainApi+this.global.userLink+'getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.moduleID).subscribe(
        (Response:any)=>{
         this.menuList = Response;
        this.global.glbMenulist = Response;
         
        }
      )

    }

    
  }




}
