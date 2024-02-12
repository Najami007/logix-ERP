import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
 
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { AddAreaComponent } from './add-area/add-area.component';

@Component({
  selector: 'app-cookingarea',
  templateUrl: './cookingarea.component.html',
  styleUrls: ['./cookingarea.component.scss']
})
export class CookingareaComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private app:AppComponent,
    private dialogue:MatDialog
  ){}




  ngOnInit(): void {
    this.global.setHeaderTitle("Cooking Area");
    this.getCookingArea();
    
  }


  tableList:any = [];


  menuSearch:any;

  getCookingArea(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetCookingAria').subscribe(
      (Response:any)=>{
        this.tableList = Response;
        console.log(Response);
      }
    )
  }


  addTable(){
    this.dialogue.open(AddAreaComponent,{
      width:'40%'
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getCookingArea();
      }
    })
  }


  editTable(item:any){

    this.dialogue.open(AddAreaComponent,{
      width:'40%',
      data:item,
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getCookingArea();
      }
      
    })
    
  }


  delete(item:any){

    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.restaurentLink+'deleteCookingAria',{
          CookingAriaID:item.cookingAriaID,
          PinCode:pin,
          UserID:this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getCookingArea();
              
            }else{
              this.msg.WarnNotify(Response.msg);
            }

            this.app.stopLoaderDark();
          }
        )
      }
    })
  }


  activeCookingArea(item:any){

    this.global.openPinCode().subscribe(pin=>{
      if(pin !== ''){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.restaurentLink+'ActiveCookingAria',{
          CookingAriaID:item.cookingAriaID,
          CookingAriaActiveStatus : !item.cookingAriaActiveStatus,
          PinCode:pin,
          UserID:this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getCookingArea();
              
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

