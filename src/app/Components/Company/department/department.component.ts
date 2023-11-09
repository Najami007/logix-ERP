import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

import { PincodeComponent } from '../../User/pincode/pincode.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { Router } from '@angular/router';
// import { AddDepartmentComponent } from './add-department/add-department.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit{

  crudList:any= [];

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){}
  ngOnInit(): void {
    this.getCrud();
    
    this.getDepartment();
  }


  
  departmentName:any;
  departmentID:any;
  description:any;
  actionbtn = 'Save';
  txtSearch:any;

  departmentList:any = [];



  getCrud(){
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globaldata.getUserID()+'&moduleid='+this.globaldata.getModuleID()).subscribe(
      (Response:any)=>{
        this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      }
    )
  }


  OpenDialogue(){
    this.dialogue.open(AddDepartmentComponent,{
      width:"40%",

    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getDepartment();
      }
    })
  }


  





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
    this.http.post(environment.mainApi+'cmp/insertdepartment',{
      DepartmentTitle: this.departmentName,
      DepartmentDescription:this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getDepartment();
          this.reset();
          $(".loaderDark").fadeOut(500);
  
        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )

  }
  
  update(pin:any){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+'cmp/updatedepartment',{
      PinCode:pin,
      DepartmentID: this.departmentID,
      DepartmentTitle: this.departmentName,
      DepartmentDescription:this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getDepartment();
          this.reset();
          $(".loaderDark").fadeOut(500);
          
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


  



  getDepartment(){
    this.http.get(environment.mainApi+'cmp/getdepartment').subscribe(
      (Response)=>{
        this.departmentList = Response;
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured')
      }
    )
  }


  editDepartment(row:any){
  this.departmentID = row.departmentID
  this.departmentName = row.departmentTitle;
  this.description = row.departmentDescription;
  this.actionbtn = 'Update';
  }


  deleteDepartment(row:any){

    this.dialogue.open(PincodeComponent,{
      width:"30%",
    
    }).afterClosed().subscribe(pin=>{
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
        this.app.startLoaderDark();    
          this.http.post(environment.mainApi+'cmp/deletedepartment',{
            PinCode:pin,
            DepartmentID:row.departmentID,
            UserID:this.globaldata.getUserID(),
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Deleted Successfully'){
                this.msg.SuccessNotify(Response.msg);
                
                this.getDepartment();
                this.app.stopLoaderDark();
              }else{
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            }
          )

          }})
        

        
      }
    })


  }

}
