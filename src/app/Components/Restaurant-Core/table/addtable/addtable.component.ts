import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PincodeComponent } from 'src/app/Components/User/pincode/pincode.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-addtable',
  templateUrl: './addtable.component.html',
  styleUrls: ['./addtable.component.scss']
})
export class AddtableComponent implements OnInit{


  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogRef:MatDialogRef<AddtableComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog:MatDialog
  ){}


  ngOnInit(): void {
    if(this.data){
      this.btntype = 'Update';
      this.tableTitle = this.data.tableTitle;
      this.description = this.data.tableDescription;
    }
  
  }

  btntype = 'Save';

  tableTitle:any = '';
  description:any = '';
  
  autoEmpty = true;



  save(){

    if(this.tableTitle == '' || this.tableTitle == undefined){
      this.msg.WarnNotify('Enter Table Title')
    }else {

      if(this.description == ''){
        this.description = '-';
      }

   
      if(this.btntype == 'Save'){
        $('.loaderDark').show();
      this.http.post(environment.mainApi+this.global.restaurentLink+'inserttable',{
        TableTitle:this.tableTitle,
        TableDescription:this.description,
        UserID:this.global.getUserID(),
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.reset();      
           if(this.autoEmpty == true){
            this.dialogRef.close('Update');
           }
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
        this.http.post(environment.mainApi+this.global.restaurentLink+'updateTable',{
          TableID:this.data.tableID,
          TableTitle:this.tableTitle,
          TableDescription:this.description,
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
    this.tableTitle = '';
    this.description = '';
  }

}
