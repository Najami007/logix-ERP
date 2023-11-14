import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService } from 'src/app/Shared/service/notification.service';
import { HttpClient } from '@angular/common/http';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
import { AddcityComponent } from './addcity/addcity.component';
import { AddCountryComponent } from '../country/add-country/add-country.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit{

  crudList:any = [];

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){}

  ngOnInit(): void {
    this.globaldata.setHeaderTitle('City');
    this.getCrud();
    this.getCity();
    this.getCountry();
   
  }


  citiesData:any;
    
  countrySearch:any;
  txtSearch:any;
  btnType = 'Save';
  cityName :any;
  countryID:any;
  cityID:any;

  countryList:any;


  getCrud(){
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globaldata.getUserID()+'&moduleid='+this.globaldata.getModuleID()).subscribe(
      (Response:any)=>{
        this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      }
    )
  }






   /////////////////////////////////////////////////////////////////////

  getCountry(){
    this.http.get(environment.mainApi+'cmp/getcountry').subscribe(
      (Response)=>{
        this.countryList = Response;
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }


   /////////////////////////////////////////////////////////////////////

  addCity(){
    if(this.cityName == '' || this.cityName == undefined){
      this.msg.WarnNotify("Please Eneter the City Name");
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
    this.http.post(environment.mainApi+'cmp/insertcity',{
      CountryID:this.countryID,
      CityName:this.cityName,
      UserID:this.globaldata.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
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
    this.http.post(environment.mainApi+'cmp/updatecity',{
      
      CityID:this.cityID,
      CountryID:this.countryID,
      CityName : this.cityName,
      UserID:this.globaldata.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getCity();
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
    this.cityName = '';
    this.btnType = 'Save';
    this.countryID = '';
  }

 /////////////////////////////////////////////////////////////////////

  getCity(){
    this.http.get(environment.mainApi+'cmp/getcity').subscribe({
      next:value=>{
    
        this.citiesData = value;
        //console.log(value);
      },
      error:error=>{
        console.log(error);
      }
    })
  }


 /////////////////////////////////////////////////////////////////////

  editCity(row:any){

   this.countryID = row.countryID;
   this.cityName = row.cityName;
   this.cityID = row.cityID;
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
        this.http.post(environment.mainApi+'cmp/deletecity',{
          CityID:row.cityID,
          UserID:this.globaldata.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
             
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
