import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddCountryComponent } from './add-country/add-country.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit{

  crudList:any =[];

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
    this.globaldata.setHeaderTitle('Country');
    this.getCountry();
  }

 
    
  txtSearch:any;
  countryName:any;
  actionbtn = 'Save';
  countryID:any;

  countryList:any = [];



  OpenDialogue(){
    this.dialogue.open(AddCountryComponent,{
      width:"40%",

    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getCountry();
      }
    })
  }






  save(){

    if(this.countryName == '' || this.countryName == undefined){
      this.msg.WarnNotify('Enter Country Name')
    }else{
      if(this.actionbtn == 'Save'){
        this.insert();
      }else if(this.actionbtn == 'Update'){
        this.update();
      }
    }
  }


  insert(){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+this.globaldata.companyLink+'insertcountry',{
      CountryName: this.countryName,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getCountry();
          $(".loaderDark").fadeOut(500);

        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )

  }
  
  update(){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+this.globaldata.companyLink+'updatecountry',{
      CountryID: this.countryID,
      CountryName: this.countryName,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getCountry();
          $(".loaderDark").fadeOut(500);
          
        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )
  }


  reset(){
    this.countryName = '';
    this.actionbtn = 'Save';
    this.countryID = '';
  }





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


  editCountry(row:any){
    this.countryID = row.countryID;
    this.countryName = row.countryName;
    this.actionbtn = 'Update';
  }


  deleteCountry(row:any){
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
        this.http.post(environment.mainApi+this.globaldata.companyLink+'deletecountry',{
          CountryID:row.countryID,
          UserID:this.globaldata.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);   
              this.getCountry();
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
