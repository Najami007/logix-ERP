import { HttpClient } from '@angular/common/http';
import {  Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog'
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AddCountryComponent } from '../../country/add-country/add-country.component';

@Component({
  selector: 'app-addcity',
  templateUrl: './addcity.component.html',
  styleUrls: ['./addcity.component.scss']
})
export class AddcityComponent implements OnInit{
 

  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<AddcityComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){

  }

  ngOnInit(): void {
   
    this.getCountry();

    if(this.editData){
      this.actionbtn = "Update";
      this.cityName = this.editData.cityName;
      this.countryID = this.editData.countryID;
    }

  }

  countrySearch:any;
  actionbtn = 'Save';
  cityName :any;
  countryID:any;

  countryList:any;


  

  addCountry(){
    this.dialogue.open(AddCountryComponent,{
      width:"40%",

    }).afterClosed().subscribe(val=>{
      this.getCountry();
    })
  }


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


  addCity(){
    if(this.cityName == '' || this.cityName == undefined){
      this.msg.WarnNotify("Please Eneter the City Name");
    }else{
      if(this.actionbtn == 'Save'){
        this.insert();
      }else if(this.actionbtn == 'Update'){
        this.update();
      }
    }
   
  }

  insert(){
    $('.loaderDark').show();
    this.http.post(environment.mainApi+'cmp/insertcity',{
      CountryID:this.countryID,
      CityName:this.cityName,
      UserID:this.global.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          $('.loaderDark').fadeOut(500);
          this.dialogRef.close();
        }else{
          this.msg.WarnNotify(Response.msg);
          $('.loaderDark').fadeOut(500);
        }
      }
    )
  }

  update(){
    $('.loaderDark').show();
    this.http.post(environment.mainApi+'cmp/updatecity',{
      
      CityID:this.editData.cityID,
      CountryID:this.countryID,
      CityName : this.cityName,
      UserID:this.global.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          $('.loaderDark').fadeOut(500);
          this.dialogRef.close('Update');
        }else{
          this.msg.WarnNotify(Response.msg);
          $('.loaderDark').fadeOut(500);
        }
      }
    )
  }


  reset(){
    this.cityName = '';
    this.actionbtn = 'Save';
    this.countryID = '';
  }

  closeDialogue(){
    this.dialogRef.close('Update');
  }
}
