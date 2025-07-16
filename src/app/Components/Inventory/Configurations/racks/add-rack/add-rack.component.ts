import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-rack',
  templateUrl: './add-rack.component.html',
  styleUrls: ['./add-rack.component.scss']
})
export class AddRackComponent {


  
  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddRackComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      $('#rackTitle').trigger('focus')
    }, 500);
  }



  txtSearch:any;
  rackTitle:any;
  rackID:number = 0;
  btnType:any = 'Save';
  description:any;



  save(){

    if(this.rackTitle == '' || this.rackTitle == undefined){
      this.msg.WarnNotify('Enter Category Title')
    }else{

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }

      $('.loaderDark').show();
      this.http.post(environment.mainApi+this.global.inventoryLink+'insertRack',{  
        RackTitle: this.rackTitle,
        RackDescription: this.description,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.dialogRef.close('Update');
            this.reset();
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
    this.rackTitle = '';
    this.rackID = 0 ;
    this.description = '';
    this.btnType = 'Save';

  }

  closeDialogue(){
    this.dialogRef.close();
  }



}
