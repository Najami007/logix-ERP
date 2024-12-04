import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService } from 'src/app/Shared/service/notification.service';
import { HttpClient } from '@angular/common/http';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent {

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
    this.globaldata.setHeaderTitle('Area');
    this.getCity();
    this.getCountry();
    this.getSavedData();
   
  }


  
    
  countrySearch:any;
  txtSearch:any;
  btnType = 'Save';
  areaTitle :any = '';
  CityID = 0;
  areaID = 0;  

  countryList:any = [];
  citiesList:any = [];
  SavedDataList:any = [];

  getCountry(){
    this.http.get(environment.mainApi+this.globaldata.companyLink+'getcountry').subscribe(
      (Response)=>{
        this.countryList = Response;
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }

  getSavedData(){
    this.http.get(environment.mainApi+this.globaldata.companyLink+'GetArea').subscribe(
      (Response)=>{
        this.SavedDataList = Response;
        //console.log(Response);
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }

   /////////////////////////////////////////////////////////////////////

  save(){
    if(this.CityID == 0 || this.CityID == undefined){
      this.msg.WarnNotify('Select City');
    }else if(this.areaTitle == '' || this.areaTitle == undefined){
      this.msg.WarnNotify("Enter the Area Name");
    }else{
      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.update();
      }
    }
   
  }


   /////////////////////////////////////////////////////////////////////

  insert(){
    $('.loaderDark').show();
    this.http.post(environment.mainApi+this.globaldata.companyLink+'insertArea',{
      CityID:this.CityID,
      AreaTitle:this.areaTitle,
      UserID:this.globaldata.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getSavedData();
          this.getCity();
          $('.loaderDark').fadeOut(500);
        }else{
          this.msg.WarnNotify(Response.msg);
          $('.loaderDark').fadeOut(500);
        }
      }
    )
  }

   /////////////////////////////////////////////////////////////////////

  update(){
    $('.loaderDark').show();
    this.http.post(environment.mainApi+this.globaldata.companyLink+'UpdateArea',{
      
      AreaID:this.areaID,
      CityID:this.CityID,
      AreaTitle:this.areaTitle,
      UserID:this.globaldata.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getCity();
          this.getSavedData();
          this.reset();
          $('.loaderDark').fadeOut(500);
        }else{
          this.msg.WarnNotify(Response.msg);
          $('.loaderDark').fadeOut(500);
        }
      }
    )
  }

 /////////////////////////////////////////////////////////////////////
  reset(){
    this.areaTitle = '';
    this.btnType = 'Save';
    this.CityID = 0;
  }

 /////////////////////////////////////////////////////////////////////

  getCity(){
    this.http.get(environment.mainApi+this.globaldata.companyLink+'getcity').subscribe({
      next:value=>{
    
        this.citiesList = value;
        //console.log(value);
      },
      error:error=>{
        console.log(error);
      }
    })
  }


 /////////////////////////////////////////////////////////////////////

  editCity(row:any){
  this.areaID = row.areaID;
   this.CityID = row.cityID;
   this.areaTitle = row.areaTitle;
   this.btnType = 'Update';
  }



  /////////////////////////////////////////////////////////////////////

  deleteCity(row:any){
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
        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi+this.globaldata.companyLink+'deleteArea',{
          AreaID:row.areaID,
          UserID:this.globaldata.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData();
              this.getCity();
              this.app.stopLoaderDark();
            }else{
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
      }
    });
  }



}
