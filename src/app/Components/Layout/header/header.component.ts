import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

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
   UserName = '';
   moduleList:any;

   menuList:any = [{title:'User Module', icon:'person', path:'user'},
    {title:'Accounts Module', icon:'account_balance', path:'acc'},
   {title:'Core Module', icon:'home', path:'core'},
   {title:'Warehouse Module', icon:'store', path:'wr'},
   {title:'HR Module', icon:'person_pin', path:'hr'},   ]

  ngOnInit() {   
    this.globalData.header_title$.subscribe((Response:string)=>{this.title = Response;alert()});
    this.getModules();
    // alert(this.globalData.getUserID())
    // this.UserName = this.globalData.getUserName().toUpperCase();
  }
  
  Menu = "menu";

  


  
 /////////////////////////////////////////////////////////////////////////

 getModules(){
  this.http.get(environment.mainApi+'user/getusermodule?userid='+this.globalData.getUserID()).subscribe(
    (Response)=>{
      this.moduleList = Response;
      // console.log(Response);
    }
  )
}

  setMenu(moduleID: any) {

    this.route.navigate(['home']);
    localStorage.setItem('mid',JSON.stringify(moduleID));

  }

  
  logout(){
    this.globalData.logout();
  }


}
