import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

import * as $ from 'jquery';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddBrandComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
  ){}

  ngOnInit(): void {
    
  }



  

  brandTitle:any;
  brandCode:any;
  description:any;
  brandID:number = 0;


  save(){
    if(this.brandTitle == '' || this.brandTitle == undefined){
      this.msg.WarnNotify('Enter Category Title')
    }else if(this.brandCode == '' || this.brandCode == undefined){
      this.msg.WarnNotify('Enter Brand Code')
    } else{

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }

      $('.loaderDark').show();
      this.http.post(environment.mainApi+'inv/insertbrand',{  
        BrandTitle: this.brandTitle,
        BrandCode: this.brandCode,
        BrandDescription: this.description,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.dialogRef.close('Update');
            $('.loaderDark').fadeOut(500);
  
          }else{
            this.msg.WarnNotify(Response.msg);
            $('.loaderDark').fadeOut(500);
          }
        },
        (error:any)=>{
          $('.loaderDark').fadeOut(500);
        }
      )

    }
    
  
  }

  closeDialogue(){
    this.dialogRef.close();
  }

}
