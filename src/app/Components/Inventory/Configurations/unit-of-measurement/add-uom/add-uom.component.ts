import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-uom',
  templateUrl: './add-uom.component.html',
  styleUrls: ['./add-uom.component.scss']
})
export class AddUOMComponent {

    AddNewProductRestrictionFeature = this.global.AddNewProductRestrictionFeature;


  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddUOMComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
  ){}

  ngOnInit(): void {
    
  }


  txtSearch:any;
  uomTitle:any;
  uomID:number = 0;



  
  save(){

    
     if(this.AddNewProductRestrictionFeature ){
      this.msg.WarnNotify('Not Allowed to Add New Unit Of Measurement');
      return;
    }

    if(this.uomTitle == '' || this.uomTitle == undefined){
      this.msg.WarnNotify('Enter Category Title')
    }else{

      $('.loaderDark').show();
      this.http.post(environment.mainApi+this.global.inventoryLink+'insertUOM',{  
        UomTitle: this.uomTitle,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.reset();
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


  reset(){
    this.uomTitle = '';
    this.uomID = 0 ;


  }


  closeDialogue(){
    this.dialogRef.close();
  }


}
