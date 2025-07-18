import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { TopNavBarComponent } from '../top-nav-bar/top-nav-bar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  
  @Output() toggleMySideBar : EventEmitter<any> = new EventEmitter();
  constructor(private app:AppComponent,
  
    private globalData : GlobalDataModule,
    private route:Router,
    private http:HttpClient,
  
    
    ) { 
    
  }
   title = 'Title';
   moduleTitle = '';
   UserName = '';
   moduleList:any;

   menuList:any = [{title:'User Module', icon:'person', path:'user'},
    {title:'Accounts Module', icon:'account_balance', path:'acc'},
   {title:'Core Module', icon:'home', path:'core'},
   {title:'Warehouse Module', icon:'store', path:'wr'},
   {title:'HR Module', icon:'person_pin', path:'hr'},   ]

  ngOnInit() {   
    this.globalData.header_title$.subscribe((Response:string)=>{this.title = Response});
     this.globalData.module_title$.subscribe((Response:string)=>{this.moduleTitle = Response});
    this.getModules();
   setTimeout(() => {
     this.moduleID = this.globalData.getModuleID();
   }, 500);
    // alert(this.globalData.getUserID())
    // this.UserName = this.globalData.getUserName().toUpperCase();
  }
  
  Menu = "menu";


  moduleID = 0;

  
 /////////////////////////////////////////////////////////////////////////

 getModules(){
  this.http.get(environment.mainApi+this.globalData.userLink+'getusermodule?userid='+this.globalData.getUserID()).subscribe(
    (Response:any)=>{
      this.moduleList = Response;
      this.moduleTitle = Response.find((e:any)=> e.moduleID == this.globalData.getModuleID()).moduleTitle.toUpperCase().split(" ")[0];
    }
  )
}

  setMenu(item: any) {
    this.moduleID = item.moduleID;
    this.route.navigate(['home']);
    localStorage.setItem('mid',JSON.stringify(item.moduleID));
    sessionStorage.setItem('mid',JSON.stringify(item.moduleID));
    this.globalData.setMenuItem(item.moduleID);
    this.globalData.setModuleTitle(item.moduleTitle.split(" ")[0]);
    // window.location.reload();
    

  }

  
  logout(){
    this.globalData.logout();
  }


}
