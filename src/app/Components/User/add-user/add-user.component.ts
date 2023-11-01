import {  HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { PincodeComponent } from '../pincode/pincode.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {


 mobileMask = this.global.mobileMask;


  constructor(
    private http:HttpClient,

    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private dialogue:MatDialog
  ){

  }


  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }

  btnType:any = 'Save';

  txtSearch:any;
  userID:any;
  UserName:any;
  loginName:any;
  mobileNo:any;
 
  RoleID:any;
  password:any;
  confirmPassword:any;


  rolesList:any = [];
  userList:any = [];



  //////////////////////////////////////////////////////////////

  getRoles(){

    this.http.get(environment.mainApi+'user/getrole').subscribe(
      (Response)=>{

        this.rolesList = Response;
      }
    )
    
  }


  //////////////////////////////////////////////////////////////


  getUsers(){
    this.app.startLoaderDark()
    this.http.get(environment.mainApi+'user/getuser').subscribe(
      (Response)=>{
        this.userList = Response;
        // console.log(Response);
        
        this.app.stopLoaderDark();

      },
      (error:any)=>{
        console.log(error);
        this.app.stopLoaderDark();
      }
    )
  }


  //////////////////////////////////////////////////////////////

  save(){
    if(this.UserName == '' || this.UserName == undefined){
      this.msg.WarnNotify('Enter User Name')
    }else if(this.loginName == '' || this.loginName == undefined){
      this.msg.WarnNotify('Enter Login Name')
    }else if(this.mobileNo == '' || this.mobileNo == undefined){
      this.msg.WarnNotify('Enter Mobile No.')
    }else if(this.RoleID == '' || this.RoleID == undefined){
      this.msg.WarnNotify('Select Role ')
    }else if(this.password == '' || this.password == undefined && this.btnType == 'Save'){
      this.msg.WarnNotify('Enter Password')
    }else if(this.confirmPassword == '' || this.confirmPassword == undefined && this.btnType == 'Save'){
      this.msg.WarnNotify('Enter Confirm Password')
    }else {

      if(this.password !== this.confirmPassword && this.btnType == 'Save' ){
        this.msg.WarnNotify('Password Donot Match')
      }
      
      if(this.btnType == 'Save'){
        this.inserUser();
      }else if(this.btnType == 'Update'){

        this.dialogue.open(PincodeComponent,{
          width:"30%",
        }).afterClosed().subscribe(val=>{         
            this.updateUser(val);  
          
        })
        
      }

    }
  }


  //////////////////////////////////////////////////////////////

  inserUser(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'user/insertuser',{
      UserName: this.UserName,
      MobileNo: this.mobileNo,
      LoginName: this.loginName,
      Password: this.password,
      RoleID: this.RoleID,
      UserID: 1
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getUsers();
          this.reset();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  //////////////////////////////////////////////////////////////

  updateUser(pinCode:any){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'user/updateuser',{
      UserID:this.userID,
      PinCode: pinCode,
      UserName: this.UserName,
      MobileNo: this.mobileNo,
      LoginName: this.loginName,
      RoleID: this.RoleID,
      
      reqUserID: 1
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getUsers();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }

    //////////////////////////////////////////////////////////////

  editUser(row:any){
    this.btnType = 'Update';
    this.userID = row.userID;
    this.UserName = row.userName;
    this.loginName = row.loginName;
    this.mobileNo = row.mobileNo;
    this.RoleID = row.roleID;

  }



  //////////////////////////////////////////////////////////////

  deleteUser(row:any){

    
    this.dialogue.open(PincodeComponent,{
      width:"30%",
    }).afterClosed().subscribe(pin=>{         
   
      if(pin !== ''){
        Swal.fire({
          title:'Alert!',
          text:'Confirm To Delete',
          position:'center',
          icon:'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result)=>{
          if(result.isConfirmed){
    
            //////on confirm button pressed the api will run
           
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+'user/deleteuser',{
        PinCode: pin,
        UserID: row.userID,
        reqUserID: 1 , // this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getUsers();
              this.app.stopLoaderDark();
            }else{
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
          }
        });
      }
      
    })


  

  }

//////////////////////////////////////////////////////////////

  blockUser(row:any,status:any){

    
    this.dialogue.open(PincodeComponent,{
      width:"30%",
    }).afterClosed().subscribe(pin=>{  
      
      if(pin !== ''){
        
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+'user/blockuser',{
          PinCode: pin,
          TempBlock:status,
          reqUserID: 1, //this.global.getUserID(),
          UserID: row.userID,
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getUsers();
              this.app.stopLoaderDark();
            }else{
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
      }
     
      
    })



   
  }

  //////////////////////////////////////////////////////////////

  resetPin(row:any){

    this.dialogue.open(PincodeComponent,{
      width:"30%",
    }).afterClosed().subscribe(pin=>{  
     
      
      if(pin !== ''){
        Swal.fire({
          title:'Alert!',
          text:'Confirm To Reset Pin',
          position:'center',
          icon:'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result)=>{
          if(result.isConfirmed){
    
            //////on confirm button pressed the api will run
            this.app.startLoaderDark();
          this.http.post(environment.mainApi+'user/resetpin',{
            PinCode: pin,
            reqUserID:1 , // this.global.getUserID(),
            UserID: row.userID,
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getUsers();
                this.app.stopLoaderDark();
              }else{
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            }
          )
          }
        });
      }})
    
   
  }


  //////////////////////////////////////////////////////////////


  reset(){
    this.userID = 0;
    this.UserName = '';
    this.loginName = '';
    this.mobileNo = '';
    this.RoleID = '';
    this.password = '';
    this.confirmPassword = '';
    this.btnType = 'Save';
  }

}
