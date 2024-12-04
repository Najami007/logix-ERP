import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-code',
  templateUrl: './add-code.component.html',
  styleUrls: ['./add-code.component.scss']
})
export class AddCodeComponent  implements OnInit{

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddCodeComponent>,
    public global: GlobalDataModule,
    private msg: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dataServie: SharedServicesDataModule,
  ) { }
  ngOnInit(): void {

    if(this.editData){
      this.btnType = 'Update';
      this.ID = this.editData.id;
      this.Code = this.editData.code;
      this.Type = this.editData.type;
      this.Title = this.editData.title;
      this.TableName = this.editData.tableName;
      this.Module = this.editData.module;
      this.Remarks = this.editData.remarks;


    }
   
  }


  btnType = 'Save';
  ID:any = '';
  Code = '';
  Type = '';
  Title = '';
  Remarks:any = ''
  TableName:any = '';
  Module:any = '';









  Save(){

   
    
      if(this.btnType == 'Save'){
        this.dataServie.saveHttp(this.global.contorlPanelLink+'insertCode',{
          ID : this.ID || 0,
          Code : this.Code || '',
          Type : this.Type || '',
          Title: this.Title || '',
          Remarks : this.Remarks || '',
          TableName : this.TableName || '',
          Module : this.Module || '',
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Saved Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.dialogRef.close('update');
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
      }else if(this.btnType == 'Update'){
        this.dataServie.saveHttp(this.global.contorlPanelLink+'updateCode',{
          AutoID:this.editData.autoID,
          ID : this.ID || 0,
          Code : this.Code || '',
          Type : this.Type || '',
          Title: this.Title || '',
          Remarks : this.Remarks || '',
          TableName : this.TableName || '',
          Module : this.Module || '',
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.dialogRef.close('update');
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
      }
    

  }



  closeDialog() {
    this.dialogRef.close();
  }


}
