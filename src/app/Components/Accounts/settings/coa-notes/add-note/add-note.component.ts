import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { CoaNotesComponent } from '../coa-notes.component';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit{


  coaTypesList:any

  actionbtn= 'Save';
  noteTitle:any;
  CoaTypeID:any;
  note:any;



  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<CoaNotesComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService
  ){}


  
  ngOnInit(): void {
    this.getCoaType();
    if(this.editData){
      this.CoaTypeID = this.editData.coaTypeID;
      this.noteTitle = this.editData.noteTitle;
      this.note = this.editData.noteID;
      this.actionbtn = 'Update';
    }
    
  }



  //////////////////////////////////////////////////////////

  getCoaType(){
    this.http.get(environment.mainApi+'getcoatype').subscribe(
      {
        next:value=>{
          // console.log(value);
          this.coaTypesList = value;
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }



  Save(){
    if(this.CoaTypeID == '' || this.CoaTypeID == undefined){
      this.msg.WarnNotify('Select Coa Type ')
    }else if(this.noteTitle == '' || this.noteTitle == undefined){
      this.msg.WarnNotify('Enter Note Title')
    }else if(this.note == '' || this.note < 0 || this.note == undefined ){
      this.msg.WarnNotify('Enter Correct Note')
    }else{

      if(this.actionbtn == 'Save'){
       this.insertNote();
      }else if(this.actionbtn == 'Update'){
        this.UpdateNote();
      }

    }
  }

 
  ///////////////////////////////////////////////////////

  insertNote(){
   
    this.http.post(environment.mainApi+'InsertNote',{
    NoteID: this.note,
    CoaTypeID: this.CoaTypeID,
    NoteTitle: this.noteTitle,
    UserID: this.global.getUserID(),
    }).subscribe(
      
      (Response:any)=>{
       
        if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.closeDialogue('Update');
            

            
        }else{
          this.msg.WarnNotify(Response.msg);
        }
      }
    )
  }


  /////////////////////////////////////////////////////

  UpdateNote(){
 
    this.http.post(environment.mainApi+'UpdateNote',{
      AutoID: this.editData.autoID,
      NoteID: this.note,
      CoaTypeID: this.CoaTypeID,
      NoteTitle: this.noteTitle,
      UserID: this.global.getUserID(),
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.reset();
              this.closeDialogue('Update');
              
  
              
          }else{
            this.msg.WarnNotify(Response.msg);
          }
        }
      )
  }



 

  /////////////////////////////////////////////////
  reset(){
    this.CoaTypeID = '';
    this.noteTitle = '';
    this.note = '';
    this.actionbtn = 'Save'
  }



  //////////////////////////////////////////////////
  closeDialogue(text:any){
    this.dialogRef.close(text);
  }
  


}

