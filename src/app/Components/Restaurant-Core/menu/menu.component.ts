import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private app:AppComponent,
    private dialogue:MatDialog,
    private route:Router
  ){

     this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }




  ngOnInit(): void {
    this.global.setHeaderTitle("Menu")
    
  }





  menuSearch:any;


  addMenu(){
    this.dialogue.open(AddMenuComponent,{
      width:'40%'
    }).afterClosed().subscribe(val=>{
      
    })
  }

}
