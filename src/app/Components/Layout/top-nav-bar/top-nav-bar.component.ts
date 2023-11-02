import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { ChangePasswordComponent } from '../../User/change-password/change-password.component';
import { ChangePINComponent } from '../../User/change-pin/change-pin.component';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit{

  constructor(private globalData:GlobalDataModule,
    private msg:NotificationService,
    private http:HttpClient,
    private route:Router,
    private dialogue:MatDialog
    ){
  
  }
  
    ngOnInit(): void {
      this.getMenu();
      this.UserName = this.globalData.getUserName();

    }
    UserName:any = 'abc';
  
      menuList:any;
    
   
  
    getMenu(){
      this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
        (Response:any)=>{
         this.menuList = Response;
         console.log(Response);
        }
      )
    }




    setSidebarMenu(module: any) {

      this.route.navigate([module]);
    }
  
    
    logout(){
      this.globalData.logout();
    }


    changePassword(){
        
    this.dialogue.open(ChangePasswordComponent,{
      width:"30%",
    }).afterClosed().subscribe(val=>{  


    })
    }

    changePin(){
        
      this.dialogue.open(ChangePINComponent,{
        width:"30%",
      }).afterClosed().subscribe(val=>{  
  
        
      })
      }
  
  
  
  }