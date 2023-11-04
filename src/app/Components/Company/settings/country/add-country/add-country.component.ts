import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss']
})
export class AddCountryComponent implements OnInit{


  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<AddCountryComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService
  ){

  }
  ngOnInit(): void {

    if(this.editData){
      this.countryName = this.editData.countryName;
      this.actionbtn = 'Update';
    }
    
  }


  countryName:any;
  actionbtn = 'Save';




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
    this.http.post(environment.mainApi+'cmp/insertcountry',{
      CountryName: this.countryName,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          $(".loaderDark").fadeOut(500);

          this.reset();
          this.dialogRef.close('Update');
        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )

  }
  
  update(){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+'cmp/updatecountry',{
      CountryID: this.editData.countryID,
      CountryName: this.countryName,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
          this.dialogRef.close('Update');
          this.reset();
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
  }


  closeDialogue(){
    this.dialogRef.close();
  }


  
}
