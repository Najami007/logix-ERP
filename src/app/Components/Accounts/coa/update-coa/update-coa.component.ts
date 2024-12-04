import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { COAComponent } from '../coa.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-update-coa',
  templateUrl: './update-coa.component.html',
  styleUrls: ['./update-coa.component.scss']
})
export class UpdateCoaComponent implements OnInit{


  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<COAComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){}

  ngOnInit(): void {
    this.getNotes();

    if(this.editData){
      this.coaTitle = this.editData.coaTitle;
      this.noteID = this.editData.noteID;
      this.coaTypeID = this.editData.coaTypeID;
      this.transactionAllowed = this.editData.transactionAllowed;
      
    }
    
  }


  notesList:any;
  coaTitle:any;
  noteID:any;
  coaTypeID:any;
  transactionAllowed:any;

  getNotes(){
    this.http.get(environment.mainApi+this.global.accountLink+'GetNote').subscribe(
      (Response )=>{
        this.notesList = Response;
      }
      
    )
  }



  UpdateChartofAccount(){
   if(this.coaTitle == '' || this.coaTitle == undefined){
      this.msg.WarnNotify('Enter Cao Title')
    }else{


      this.global.openPinCode().subscribe(pin=>{
        if(pin != ''){
          $('.loaderDark').show();
      
          this.http.post(environment.mainApi+this.global.accountLink+'UpdateChartofAccount',{
            CoaID: this.editData.coaID,
            CoaTitle: this.coaTitle,
            NoteID:this.noteID,
            pinCode:pin,
            UserID: this.global.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.dialogRef.close('Update');
                $('.loaderDark').fadeOut(500);
      
              }else{
                this.msg.WarnNotify(Response.msg);
                $('.loaderDark').fadeOut(500);
              }
            }
          )
        }
      })
     
    }
   
  }



  closeDialogue(){
    this.dialogRef.close();
  }




}