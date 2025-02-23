import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PincodeComponent } from 'src/app/Components/User/pincode/pincode.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.scss']
})
export class AddAreaComponent implements OnInit{


  constructor(
    private dataService:SharedServicesDataModule,
    private http:HttpClient,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogRef:MatDialogRef<AddAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog:MatDialog
  ){}


  ngOnInit(): void {
    if(this.data){
      this.btntype = 'Update';
      this.cookingAreaTitle = this.data.cookingAriaTitle;
      this.description = this.data.cookingAriaDescription;
      this.PrinterName = this.data.printerName;
      this.PrinterPort = this.data.printerPort;
    }
  
  }

  btntype = 'Save';

  cookingAreaTitle:any = '';
  description:any = '';
  
  PrinterName = '';
  PrinterPort = '';


  save(){

    if(this.cookingAreaTitle == '' || this.cookingAreaTitle == undefined){
      this.msg.WarnNotify('Enter Table Title')
    }
    if(this.PrinterName == '' || this.PrinterName == undefined){
      this.msg.WarnNotify('Enter Printer Name')
    }
    if(this.PrinterPort == '' || this.PrinterPort == undefined){
      this.msg.WarnNotify('Enter Printer Port')
    }else {

      if(this.description == ''){
        this.description = '-';
      }

   
      if(this.btntype == 'Save'){
        $('.loaderDark').show();
        

      this.http.post(environment.mainApi+this.global.restaurentLink+'insertCookingAria',{
        CookingAriaTitle:this.cookingAreaTitle,
        CookingAriaDescription:this.description,
        PrinterName : this.PrinterName,
        PrinterPort : this.PrinterPort,
        UserID:this.global.getUserID(),
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.reset();      
            this.dialogRef.close('Update');
          }else{
            this.msg.WarnNotify(Response.msg);
          }
  
          $('.loaderDark').fadeOut(200);
        }
      )
      }
      if(this.btntype == 'Update'){
        this.global.openPinCode().subscribe(pin=>{
        if(pin != ''){
          $('.loaderDark').show();
        this.http.post(environment.mainApi+this.global.restaurentLink+'UpdateCookingAria',{
          CookingAriaID:this.data.cookingAriaID,
          CookingAriaTitle:this.cookingAreaTitle,
          CookingAriaDescription:this.description,
          PrinterName : this.PrinterName,
          PrinterPort : this.PrinterPort,
          PinCode:pin,  
          UserID:this.global.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.reset();      
              this.dialogRef.close('Update');
            }else{
              this.msg.WarnNotify(Response.msg);
            }
    
            $('.loaderDark').fadeOut(200);
          }
        )
        }
       })
        }
    }

   

  }


  closeDialogue(){
    this.dialogRef.close();
  }

  reset(){
    this.cookingAreaTitle = '';
    this.description = '';
    this.PrinterName = '';
    this.PrinterPort = '';
    this.btntype = 'Save';
  }

}
