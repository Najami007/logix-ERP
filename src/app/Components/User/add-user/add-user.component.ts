import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { PincodeComponent } from '../pincode/pincode.component';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userRoleTypeID = this.global.getRoleTypeID();

  @ViewChild(UserFormComponent) addUser: any;

  mobileMask = this.global.mobileMask;


  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,

    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private dialogue: MatDialog,
    private route: Router
  ) {
    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Add User');
    this.getUsers();
    this.getRoles();
    this.getProject();
    this.getRoleTypes();
  }

  btnType: any = 'Save';



  txtSearch: any;


  roleTypeList: any = [];
  tmpRoleTypeList: any = [
    { roleTypeID: 1, roleTypeTitle: 'Super Admin' },
    { roleTypeID: 2, roleTypeTitle: 'Admin' },
    { roleTypeID: 3, roleTypeTitle: 'User' }];

  rolesList: any = [];
  userList: any = [];
  projectList: any = [];


  getRoleTypes() {
    this.roleTypeList = this.tmpRoleTypeList;

    if (this.userRoleTypeID == 2) {
      this.roleTypeList = this.tmpRoleTypeList.filter((e: any) => e.roleTypeID >= 2);
    }
    if (this.userRoleTypeID == 3) {
      this.roleTypeList = this.tmpRoleTypeList.filter((e: any) => e.roleTypeID > 2);
    }
  }


  getProject() {
    this.http.get(environment.mainApi + 'cmp/getproject').subscribe(
      (Response: any) => {
        this.projectList = Response;

      }
    )
  }




  //////////////////////////////////////////////////////////////

  getRoles() {

    this.http.get(environment.mainApi + this.global.userLink + 'getrole').subscribe(
      (Response) => {

        this.rolesList = Response;
      }
    )

  }


  //////////////////////////////////////////////////////////////


  getUsers() {
    this.app.startLoaderDark()
    this.http.get(environment.mainApi + this.global.userLink + 'getuser').subscribe(
      (Response: any) => {

        if (this.userRoleTypeID == 1) {
          this.userList = Response;
        }


        if (this.userRoleTypeID == 2) {
          this.userList = Response.filter((e: any) => e.roleTypeID >= 2);
        }
        if (this.userRoleTypeID == 3) {
          this.userList = Response.filter((e: any) => e.roleTypeID > 2);
        }
        this.app.stopLoaderDark();

      },
      (error: any) => {
        console.log(error);
        this.app.stopLoaderDark();
      }
    )
  }


  //////////////////////////////////////////////////////////////

  save() {

    var postData: any = {
      UserID: this.addUser.userID,
      UserName: this.addUser.UserName,
      UserEmail: this.addUser.userEmail,
      MobileNo: this.addUser.mobileNo,
      LoginName: this.addUser.loginName,
      RoleID: this.addUser.RoleID,
      projectID: this.addUser.projectID,
      RoleTypeID: this.addUser.roleTypeID,
      Password:this.addUser.password,
      reqUserID: this.global.getUserID()
    }


    if (this.addUser.UserName == '' || this.addUser.UserName == undefined) {
      this.msg.WarnNotify('Enter User Name')
    } else if (this.addUser.loginName == '' || this.addUser.loginName == undefined) {
      this.msg.WarnNotify('Enter Login Name')
    } else if (this.addUser.mobileNo == '' || this.addUser.mobileNo == undefined) {
      this.msg.WarnNotify('Enter Mobile No.')
    } else if (this.addUser.RoleID == 0 || this.addUser.RoleID == undefined) {
      this.msg.WarnNotify('Select Role ')
    } else if (this.addUser.roleTypeID == 0) {
      this.msg.WarnNotify('Select Role Type')
    }
    else if (this.addUser.projectID == 0 || this.addUser.projectID == undefined) {
      this.msg.WarnNotify('Select Project ')
    }
    else if ((this.addUser.password == '' || this.addUser.password == undefined) && this.btnType == 'Save') {
      this.msg.WarnNotify('Enter Password')
    } else if ((this.addUser.confirmPassword == '' || this.addUser.confirmPassword == undefined) && this.btnType == 'Save') {
      this.msg.WarnNotify('Enter Confirm Password')
    } else {

      if (this.addUser.password !== this.addUser.confirmPassword && this.btnType == 'Save') {
        this.msg.WarnNotify('Password Donot Match')
      }


      if (this.btnType == 'Save') {
        this.inserUser(postData);
      } else if (this.btnType == 'Update') {

        this.global.openPinCode().subscribe(pin => {
          if (pin != '') {
            this.updateUser(postData, pin);
          }

        })

      }

    }
  }


  //////////////////////////////////////////////////////////////

  inserUser(postData: any) {
    this.app.startLoaderDark();
    postData.UserID = this.global.getUserID();
    this.http.post(environment.mainApi + this.global.userLink + 'insertuser', postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getUsers();
          this.reset();
          this.app.stopLoaderDark();
          this.global.closeBootstrapModal('#addUser', true);
        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error: any) => {
        this.app.stopLoaderDark();
      }
    )
  }


  //////////////////////////////////////////////////////////////

  updateUser(postData: any, pinCode: any) {
    this.app.startLoaderDark();
    postData['pinCode'] = pinCode;
    this.http.post(environment.mainApi + this.global.userLink + 'updateuser', postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getUsers();
          this.app.stopLoaderDark();
          this.global.closeBootstrapModal('#addUser', true);
        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error: any) => {
        this.app.stopLoaderDark();
      }
    )
  }

  //////////////////////////////////////////////////////////////

  editUser(row: any) {
    this.global.openBootstrapModal('#addUser', true);
    this.btnType = 'Update';
    this.addUser.userID = row.userID;
    this.addUser.UserName = row.userName;
    this.addUser.loginName = row.loginName;
    this.addUser.mobileNo = row.mobileNo;
    this.addUser.RoleID = row.roleID;
    this.addUser.userEmail = row.userEmail;
    this.addUser.projectID = row.projectID;
    this.addUser.roleTypeID = row.roleTypeID;

      this.addUser.setFocus();

  }



  //////////////////////////////////////////////////////////////

  deleteUser(row: any) {

    if (row.userID == this.global.getUserID()) {
      this.msg.WarnNotify('Unable To Delete this user');
      return;
    }


    this.global.openPinCode().subscribe(pin => {

      if (pin !== '') {
        Swal.fire({
          title: 'Alert!',
          text: 'Confirm To Delete',
          position: 'center',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result) => {
          if (result.isConfirmed) {

            //////on confirm button pressed the api will run

            this.app.startLoaderDark();
            this.http.post(environment.mainApi + this.global.userLink + 'deleteuser', {
              PinCode: pin,
              UserID: row.userID,
              reqUserID: this.global.getUserID()
            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getUsers();
                  this.app.stopLoaderDark();
                } else {
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

  blockUser(row: any, status: any) {


    this.global.openPinCode().subscribe(pin => {

      if (pin !== '') {

        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.global.userLink + 'blockuser', {
          PinCode: pin,
          TempBlock: status,
          reqUserID: this.global.getUserID(),
          UserID: row.userID,
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getUsers();
              this.app.stopLoaderDark();
            } else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
      }


    })




  }

  //////////////////////////////////////////////////////////////

  resetPin(row: any) {

    this.global.openPinCode().subscribe(pin => {


      if (pin !== '') {
        Swal.fire({
          title: 'Alert!',
          text: 'Confirm To Reset Pin',
          position: 'center',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result) => {
          if (result.isConfirmed) {

            //////on confirm button pressed the api will run
            this.app.startLoaderDark();
            this.http.post(environment.mainApi + this.global.userLink + 'resetpin', {
              PinCode: pin,
              reqUserID: this.global.getUserID(),
              UserID: row.userID,
            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Updated Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getUsers();
                  this.app.stopLoaderDark();
                } else {
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

  //////////////////////////////////////////////////////////


  ChangePassword(userID: any) {
    this.dialogue.open(ChangePasswordComponent, {
      width: '30%',
      data: userID

    }).afterClosed().subscribe(val => {

    })
  }


  //////////////////////////////////////////////////////////////


  reset() {
    this.addUser.userID = 0;
    this.addUser.UserName = '';
    this.addUser.loginName = '';
    this.addUser.mobileNo = '';
    this.addUser.RoleID = 0;
    this.addUser.roleTypeID = 0;

    this.addUser.password = '';
    this.addUser.confirmPassword = '';
    this.btnType = 'Save';
    this.addUser.userEmail = '';
    this.addUser.projectID = 0;
  }


  addNewUser() {
    this.global.openBootstrapModal('#addUser', true);
    this.addUser.setFocus();
    this.reset();
  }

}
