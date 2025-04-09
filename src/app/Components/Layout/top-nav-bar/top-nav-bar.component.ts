import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Host, HostBinding, Inject, OnInit, Output, Renderer2, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { ChangePasswordComponent } from '../../User/change-password/change-password.component';
import { ChangePINComponent } from '../../User/change-pin/change-pin.component';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { MainComponent } from '../main/main.component';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from 'ngx-toastr';
import { UpdateSubscriptionComponent } from '../../User/update-subscription/update-subscription.component';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit{
  clickEventSubscription: Subscription;

    public  menuList?:any = [];
    moduleID?: string | null;
    
    

    subscriptionFeature = this.globalData.getFeature('')
   
    @Output() toggleMySideBar : EventEmitter<any> = new EventEmitter();
    toggleControl: any;
  constructor(private globalData:GlobalDataModule,
    private msg:NotificationService,
    private http:HttpClient,
    private route:Router,
    private dialogue:MatDialog,
    private app:AppComponent,
    private m :MainComponent,
    private overlay :OverlayContainer,

    private render:Renderer2,
    ){

      this.clickEventSubscription = this.globalData
      .getMenuItem()
      .subscribe((value: any) => {
        this.moduleID = value;
        this.getMenu();
       
      });
      


  }

   
  ngOnInit(): void {

    this.moduleID = localStorage.getItem('mid');
    this.UserName = this.globalData.getUserName();
    this.getMenu();
    this.getCompany();
  

  }

  changeThemeFlag = false;









  Menu = "menu";
  
  toggleSideBar(){
    this.toggleMySideBar.emit(); 
    
  if(this.m.sideBarOpen){
      this.Menu = "menu_open";
     
    }else{
      this.Menu = "menu";

    }
  }

 
 



    UserName:any = 'abc';
    companyProfile:any;
    logo1:any = '../../../../assets/Images/logo.png';
    height:any = 0;
    width:any = 0;

    ////////////////////////////////////////////////////////////////////////
  getCompany(){
    this.http.get(environment.mainApi+this.globalData.companyLink+'getcompanyprofile').subscribe(
      (Response:any)=>{
        if(Response != ''){
          this.companyProfile = Response;
        this.logo1 = this.companyProfile[0].companyLogo3; 
        this.height = this.companyProfile[0].logo3Height;
        this.width = this.companyProfile[0].logo3Width;
        
        //console.log(Response);  
        this.globalData.comapnayProfile = Response[0];      
        }
        
      }
    )
  }



  
  hideFlag = true;

  // hideUnhide(){
  //  this.hideFlag != this.hideFlag;
  //  if(this.hideFlag == true){
  //   $('#menubar').fadeOut(500);
  //   // $('#menuBar2').fadeOut(500);
  //  }

  //  if(this.hideFlag == false){
  //   $('#menubar').show();
  //   // $('#menuBar2').show();
  //  }

  // }
 
    
   
  
    getMenu(){

      if (
        this.moduleID != null &&
        (typeof this.moduleID == 'string' || typeof this.moduleID == 'number')
      ){

  

        this.http.get(environment.mainApi+this.globalData.userLink+'getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.moduleID).subscribe(
          (Response:any)=>{
           this.menuList = Response;
          this.globalData.glbMenulist = Response;
          //console.log(Response);

          //  this.globalData.setMenuList(Response);
           
          }
        )

      }

      
    }




    setSidebarMenu(module: any) {

      this.route.navigate([module]);
    }

    // setMenuID(item:any){
    //   this.globalData.setMenuList(item);

    // }
  
    
    logout(){
      this.globalData.logout();
    }


    changePassword(){    
    this.dialogue.open(ChangePasswordComponent,{
      width:"30%",
      data:this.globalData.getUserID()
    }).afterClosed().subscribe(val=>{  


    })
    }

    changePin(){
        
      this.dialogue.open(ChangePINComponent,{
        width:"30%",
      }).afterClosed().subscribe(val=>{  
  
        
      })
      }
  



      setMenu(item: any) {

        this.route.navigate(['home']);
        localStorage.setItem('mid',JSON.stringify(item.moduleID));
        this.globalData.setMenuItem(item.moduleID);
        // window.location.reload();
        
    
      }


      updateSubscription(){
        this.globalData.updateSubscription({UserID:this.globalData.getUserID()})
      }

  
  }