import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddMenuCategoryComponent } from './add-menu-category/add-menu-category.component';


@Component({
  selector: 'app-menu-category',
  templateUrl: './menu-category.component.html',
  styleUrls: ['./menu-category.component.scss']
})
export class MenuCategoryComponent implements OnInit{
  @ViewChild(AddMenuCategoryComponent) addCategory: any;

  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private dialog:MatDialog,
    private route:Router

  ){

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }



  ngOnInit(): void {
    
  }


  txtSearch:any;

  menuCategoryList:any = [];




  edit(row:any){}

  delete(row:any){}

}
