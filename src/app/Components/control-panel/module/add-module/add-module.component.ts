import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {

  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddModuleComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dataServie:SharedServicesDataModule,
  ){}
  ngOnInit(): void {
    if(this.editData){
      this.btnType = 'Update';
      this.moduleTitle = this.editData.moduleTitle;
      this.description = this.editData.moduleDescription;
      this.moduleIcon = this.editData.moduleIcon;
      this.moduleLink = this.editData.moduleLink;
    }
  }


  UserID = this.global.getUserID();
  btnType = 'Save';

  moduleTitle:String= '';
  description:String = '';
  moduleIcon:String = '';
  moduleLink:String= '';


 


  Save(){

    var funcLink = 'insertModule';

    if(this.btnType == 'Update'){
      funcLink = 'updateModule'
    }


    if(this.moduleTitle == '' || this.moduleTitle == undefined){
      this.msg.WarnNotify('Enter Module Title')
    }else if(this.moduleIcon == '' || this.moduleIcon == undefined){
      this.msg.WarnNotify('Enter Module Icon')
    }else if(this.moduleLink == '' || this.moduleLink == undefined){
      this.msg.WarnNotify('Enter Module Link')
    }else if(this.description == '' || this.description == undefined){
      this.msg.WarnNotify('Enter Module Description')
    }else{

      this.dataServie.saveHttp(this.global.contorlPanelLink + funcLink , {
        ModuleID : this.editData.moduleID,
        ModuleTitle:this.moduleTitle,
        ModuleIcon :this.moduleIcon,
        ModuleLink : this.moduleLink,
        ModuleDescription:this.description,
        UserID : this.UserID,
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.dialogRef.close('update');
          }else{
            this.msg.WarnNotify(Response.msg);
          }
        }
      )

    }


   


  }


  closeDialog(){
    this.dialogRef.close();
  }







}
