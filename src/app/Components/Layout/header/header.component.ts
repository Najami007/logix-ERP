import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  
  @Output() toggleMySideBar : EventEmitter<any> = new EventEmitter();
  constructor(private app:AppComponent,
  
    private globalData : GlobalDataModule,
    private route:Router
    ) { 
    
  }
   title = 'Title';
   UserName = '';

  ngOnInit() {   
    this.globalData.header_title$.subscribe((Response:string)=>{this.title = Response;alert()});
    // this.UserName = this.globalData.getUserName().toUpperCase();
  }

  reload(){
    location.reload();
  }
 
  
  Menu = "menu";

  toggleSideBar(){
    this.toggleMySideBar.emit(); 
    this.log();
  }

  log(){

    // if(this.m.sideBarOpen == true){
    //   this.Menu = "menu_open";
    // }else{
    //   this.Menu = "menu";
    // }
  }

  setSidebarMenu(module: any) {

    this.route.navigate([module]);
  }

  
  logout(){
    this.globalData.logout();
  }


}
