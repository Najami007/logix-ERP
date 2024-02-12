import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNoteComponent } from './add-note/add-note.component';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { HttpClient } from '@angular/common/http';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
import { PincodeComponent } from 'src/app/Components/User/pincode/pincode.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coa-notes',
  templateUrl: './coa-notes.component.html',
  styleUrls: ['./coa-notes.component.scss']
})
export class CoaNotesComponent implements OnInit{
  crudList:any = [];

  constructor(
    private dialogue:MatDialog,
    private msg:NotificationService,
    private http:HttpClient,
    private globalData:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
  ){

    this.globalData.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }


  ngOnInit(): void {
    this.getNotes();
    
  }


  notesData:any;


  
  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }





  getNotes(){
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetNote').subscribe(
      (Response )=>{
        this.notesData = Response;

      }
      
    )
  }



  editNote(row:any){
    this.dialogue.open(AddNoteComponent,{
      width:"40%",
      data:row,
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getNotes();
      }
    })
  }
    
  


 /////////////////////////////////////////////////

 deleteNote(row:any){


  this.globalData.openPinCode().subscribe(pin=>{
    if(pin != ''){
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
    
          //////on confirm button pressed the api will run
          this.app.startLoaderDark();
          this.http.post(environment.mainApi+this.globalData.accountLink+'DeleteNote',{
            AutoID: row.autoID,
           NoteID: row.noteID,
           PinCode:pin,
          UserID: this.globalData.getUserID(),
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Deleted Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getNotes();
                this.app.stopLoaderDark();
              }else{
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            },
            (Error)=>{
              this.app.stopLoaderDark();
            }
          )
        }
      });
    }
  })




 
}


  OpenDialogue(){
    this.dialogue.open(AddNoteComponent,{
      width:"40%",

    }).afterClosed().subscribe(val=>{
    
      if(val == 'Update'){
        this.getNotes();
      }

    })
  }
}

