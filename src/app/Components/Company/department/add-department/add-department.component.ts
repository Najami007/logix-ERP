import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PincodeComponent } from 'src/app/Components/User/pincode/pincode.component';

import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit{


  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<AddDepartmentComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){

  }
  ngOnInit(): void {

    if(this.editData){
      this.departmentName = this.editData.departmentTitle;
      this.description = this.editData.departmentDescription;
      this.actionbtn = 'Update';
    }
    
  }


  departmentName:any;
  description:any;
  actionbtn = 'Save';




  save(){

    if(this.departmentName == '' || this.departmentName == undefined){
      this.msg.WarnNotify('Enter Department Name')
    }else{
      if(this.actionbtn == 'Save'){
        this.insert();
      }else if(this.actionbtn == 'Update'){
        
        this.dialogue.open(PincodeComponent,{
          width:'30%'

        }).afterClosed().subscribe(pin=>{
        
          if(pin != ''){
            this.update(pin);
          }
        }

        )
      }
    }
  }


  insert(){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+this.global.companyLink+'insertdepartment',{
      DepartmentTitle: this.departmentName,
      DepartmentDescription:this.description,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          $(".loaderDark").fadeOut(500);

          this.reset();
          this.dialogRef.close('Update');
        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )

  }
  
  update(pin:any){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+this.global.companyLink+'updatedepartment',{
      PinCode:pin,
      DepartmentID: this.editData.departmentID,
      DepartmentTitle: this.departmentName,
      DepartmentDescription:this.description,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
          this.dialogRef.close('Update');
          this.reset();
        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )
  }


  reset(){
    this.departmentName = '';
    this.description = '';
    this.actionbtn = 'Save';
  }


  closeDialogue(){
    this.dialogRef.close();
  }


  
}
