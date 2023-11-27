import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddMenuComponent } from './add-menu/add-menu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private app:AppComponent,
    private dialogue:MatDialog
  ){}




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
