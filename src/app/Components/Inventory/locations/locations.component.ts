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
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit{

  crudList:any = {c:true,r:true,u:true,d:true};

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
    this.globaldata.setHeaderTitle('Location');
    this.getLocation();
   
  }

  txtSearch:any;
  locationTitle:any;
  locationID:number = 0;
  btnType:any = 'Save';
  description:any;
  locationList:any = [];



  getLocation(){
    this.http.get(environment.mainApi+this.globaldata.inventoryLink+'getlocation').subscribe(
      (Response:any)=>{
        this.locationList = Response;
      }
    )
  }



  save(){
    if(this.locationTitle == '' || this.locationTitle == undefined){
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
    this.http.post(environment.mainApi+this.globaldata.inventoryLink+'insertlocation',{  
      LocationTitle: this.locationTitle,
      LocationDescription: this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getLocation();
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

    this.globaldata.openPinCode().subscribe(pin=>{

     if(pin != ''){

      
      this.app.startLoaderDark();
      this.http.post(environment.mainApi+this.globaldata.inventoryLink+'updatelocation',{
        LocationID:this.locationID,  
        LocationTitle: this.locationTitle,
        LocationDescription: this.description,
        PinCode:pin,
        UserID: this.globaldata.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getLocation();
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
    this.locationTitle = '';
    this.locationID = 0 ;
    this.description ='';
    this.btnType = 'Save';

  }


  edit(row:any){
    this.locationID = row.locationID;
    this.locationTitle = row.locationTitle;
    this.description = row.locationDescription;
    this.btnType = 'Update';
  }

  delete(row:any){
    this.globaldata.openPinCode().subscribe(pin=>{

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

      this.http.post(environment.mainApi+this.globaldata.inventoryLink+'deletelocation',{
        LocationID: row.locationID,
        PinCode:pin,
        UserID: this.globaldata.getUserID()

      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Deleted Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getLocation();
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
