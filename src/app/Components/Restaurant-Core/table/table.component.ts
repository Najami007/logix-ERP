import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddtableComponent } from './addtable/addtable.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private app:AppComponent,
    private dialogue:MatDialog
  ){}




  ngOnInit(): void {
    this.global.setHeaderTitle("Table");
    this.getTable();
    
  }


  tableList:any = [];


  menuSearch:any;

  getTable(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetTable').subscribe(
      (Response:any)=>{
        this.tableList = Response;
        //console.log(Response);
      }
    )
  }


  addTable(){
    this.dialogue.open(AddtableComponent,{
      width:'40%'
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getTable();
      }
    })
  }


  editTable(item:any){

    this.dialogue.open(AddtableComponent,{
      width:'40%',
      data:item,
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getTable();
      }
      
    })
    
  }


  delete(item:any){

    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.restaurentLink+'deleteTable',{
          TableID:item.tableID,
          PinCode:pin,
          UserID:this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getTable();
              
            }else{
              this.msg.WarnNotify(Response.msg);
            }

            this.app.stopLoaderDark();
          }
        )
      }
    })
  }

}
