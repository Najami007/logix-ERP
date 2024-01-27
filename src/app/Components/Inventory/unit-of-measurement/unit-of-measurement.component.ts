import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unit-of-measurement',
  templateUrl: './unit-of-measurement.component.html',
  styleUrls: ['./unit-of-measurement.component.scss']
})
export class UnitOfMeasurementComponent implements OnInit{

  crudList:any = [];

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){
      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Unit Of Measurement')
    this.getUOMList();
    
   
  }

  txtSearch:any;
  uomTitle:any;
  uomID:number = 0;
  btnType:any = 'Save';

  UOMList:any = [];




  getUOMList(){
    this.http.get(environment.mainApi+this.globaldata.inventoryLink+'GetUOM').subscribe(
      (Response:any)=>{
        this.UOMList = Response;
      }
    )
  }



  save(){
    if(this.uomTitle == '' || this.uomTitle == undefined){
      this.msg.WarnNotify('Enter Category Title')
    }else{

   

      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.update();

      }

    }

  }




  insert(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.globaldata.inventoryLink+'insertUOM',{  
      UomTitle: this.uomTitle,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getUOMList();
          this.reset();
          this.app.stopLoaderDark();

        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }

  update(){

    this.dialogue.open(PincodeComponent,{
      width:'30%'
    }).afterClosed().subscribe(pin=>{

     if(pin != ''){

      
      this.app.startLoaderDark();
      this.http.post(environment.mainApi+this.globaldata.inventoryLink+'updateUOM',{
        UomID:this.uomID,  
        UomTitle: this.uomTitle,
        PinCode:pin,
        UserID: this.globaldata.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getUOMList();
            this.reset();
            this.app.stopLoaderDark();
  
          }else{
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
        },
        (error:any)=>{
          this.app.stopLoaderDark();
        }
      )
     }
    })
   
  }



  reset(){
    this.uomTitle = '';
    this.uomID = 0 ;
    this.btnType = 'Save';

  }


  edit(row:any){
    this.uomID  = row.uomID;
    this.uomTitle = row.uomTitle;
    this.btnType  = 'Update';
  }

  delete(row:any){ 
    this.dialogue.open(PincodeComponent,{
      width:'30%'
    }).afterClosed().subscribe(pin=>{

     if(pin != ''){


      Swal.fire({
        title:'Alert!',
        text:'Confirm to Delete the Data',
        position:'center',
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
      }).then((result)=>{

        if(result.isConfirmed){
      this.app.startLoaderDark();

      this.http.post(environment.mainApi+this.globaldata.inventoryLink+'deleteUOM',{
        UOMID: row.uomID,
        PinCode:pin,
        UserID: this.globaldata.getUserID()

      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Deleted Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getUOMList();
            this.app.stopLoaderDark();
          
            
          }else{
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
        },
        (error:any)=>{
          this.app.stopLoaderDark();
        }
      )

      }
     }
     )


     }})

  }
}
