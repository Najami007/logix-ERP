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
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.scss']
})
export class RacksComponent implements OnInit{

  crudList:any = [];

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){}
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Rack')
    this.getCrud();
    this.getRacksList();
    
   
  }

  txtSearch:any;
  rackTitle:any;
  rackID:number = 0;
  btnType:any = 'Save';
  description:any;

  RacksList:any = [];





  getCrud(){
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globaldata.getUserID()+'&moduleid='+this.globaldata.getModuleID()).subscribe(
      (Response:any)=>{
        this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      }
    )
  }





  getRacksList(){
    this.http.get(environment.mainApi+'inv/getrack').subscribe(
      (Response:any)=>{
        this.RacksList = Response;
      }
    )
  }



  save(){
    if(this.rackTitle == '' || this.rackTitle == undefined){
      this.msg.WarnNotify('Enter Category Title')
    }else{

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }

      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.update();

      }

    }

  }




  insert(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'inv/insertRack',{  
      RackTitle: this.rackTitle,
      RackDescription: this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getRacksList();
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
      this.http.post(environment.mainApi+'inv/updateRack',{
        RackID:this.rackID,  
        RackTitle: this.rackTitle,
        RackDescription: this.description,
        PinCode:pin,
        UserID: this.globaldata.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getRacksList();
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
    this.rackTitle = '';
    this.rackID = 0 ;
    this.description = '';
    this.btnType = 'Save';

  }


  edit(row:any){
    this.rackID  = row.rackID;
    this.rackTitle = row.rackTitle;
    this.description = row.rackDescription;
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

      this.http.post(environment.mainApi+'inv/deleteRack',{
        RackID: row.rackID,
        PinCode:pin,
        UserID: this.globaldata.getUserID()

      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Deleted Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getRacksList();
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
