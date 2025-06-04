import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
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
    this.global.setHeaderTitle('Create Roles');
    this.getModules();
    this.getMenuList();
    this.getSavedRoles();
  }


  btnType: any = 'Save';

  txtSearch: any;
  tabIndex: any;
  roleTitle: any;
  roleDescription: any;
  moduleID: any;
  roleID: any;

  rolesList: any = [];
  moduleList: any = [];
  menuList: any = [];
  tempMenyList: any = [];


  selectedModuleMenuList: any = [];
  TempModuleList: any = [];



  /////////////////////////////////////////////////////////////////////////


  getSavedRoles() {
    this.http.get(environment.mainApi + this.global.userLink + 'GetRole').subscribe(

      (Response: any) => {
        this.rolesList = Response;
        // console.log(Response);
      }
    )
  }


  /////////////////////////////////////////////////////////////////////////

  getModules() {
    this.http.get(environment.mainApi + this.global.userLink + 'GetModule').subscribe(
      (Response) => {
        this.moduleList = Response;
      }
    )
  }


  /////////////////////////////////////////////////////////////////////////


  getMenuList() {
    this.http.get(environment.mainApi + this.global.userLink + 'getmenu').subscribe(
      (Response) => {
        this.menuList = Response;
        // console.log(Response);
      }
    )
  }

  /////////////////////////////////////////////////////////////


  save() {

    var menuStatus = false;

    this.menuList.forEach((e: any) => {
      if (e.c == true || e.r == true || e.u == true || e.d == true) {
        menuStatus = true;
      }
    });

    if (this.roleTitle == '' || this.roleTitle == undefined) {
      this.msg.WarnNotify('Enter Role Title');
    } else if (menuStatus == false) {
      this.msg.WarnNotify('Select Atleast One Menu');
    } else {

      if (this.roleDescription == '' || this.roleDescription == undefined) {
        this.roleDescription = '-'
      }

      if (this.btnType == 'Save') {
        this.insertRole();
      } else if (this.btnType == 'Update') {


        //////////// will open the pin code field and on close call the api

        this.global.openPinCode().subscribe(pin => {
          if (pin !== '') {
            this.updateRole(pin);
          }

        })
      }


    }
  }


  ///////////////////////////////////////////////////////////


  insertRole() {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.userLink + 'insertrole', {
      RoleTitle: this.roleTitle,
      RoleDescription: this.roleDescription,
      RoleDetail: JSON.stringify(this.menuList),
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getSavedRoles();
          this.reset();
          this.app.stopLoaderDark();
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



  ///////////////////////////////////////////////////////////

  updateRole(pin: any) {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.userLink + 'updaterole', {
      PinCode: pin,
      RoleID: this.roleID,
      RoleTitle: this.roleTitle,
      RoleDescription: this.roleDescription,
      RoleDetail: JSON.stringify(this.menuList),
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getSavedRoles();

          this.reset();
          this.app.stopLoaderDark();
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


  addToSelectedModule(item: any, index: any, type: any) {

    if (type == 'a') {

      if (item.a == true) {
        this.menuList[index].c = true;
        this.menuList[index].r = true;
        this.menuList[index].u = true;
        this.menuList[index].d = true;
      }

      if (item.a == false) {
        this.menuList[index].c = false;
        this.menuList[index].r = false;
        this.menuList[index].u = false;
        this.menuList[index].d = false;
      }

    }



    if (item.c == false || item.r == false || item.u == false || item.d == false) {
      item.a = false;

      // var moduleIndex = this.TempModuleList.findIndex((md:any)=>md.moduleID == item.moduleID);
      // var menuIndex = this.TempModuleList[moduleIndex].tempMenuList.findIndex((tm:any)=>tm.menuID == item.menuID);

      // this.TempModuleList[moduleIndex].tempMenuList.splice(menuIndex,1);
      // console.log(this.TempModuleList,menuIndex,moduleIndex);
    }



    if (this.TempModuleList.filter((m: any) => m.moduleID == item.moduleID).length == 0) {



      this.TempModuleList.push({
        moduleID: item.moduleID,
        moduleTitle: this.moduleList[this.moduleList.findIndex((mod: any) => mod.moduleID == item.moduleID)].moduleTitle,
        tempMenuList: [{ menuID: item.menuID, menuTitle: item.menuTitle, c: item.c, r: item.r, u: item.u, d: item.d, }],
      })
    } else {

      ////////////////////will check whether selected menu module is already in tmpmodule list of not//////////////

      if (this.TempModuleList.filter((m: any) => m.moduleID == item.moduleID).length != 0) {

        ///////////// will find the index of the selected module from the tmpmodulelist//////////
        var moduleIndex = this.TempModuleList.findIndex((md: any) => md.moduleID == item.moduleID);

        ////////////////////////////////  will chack wheter the selected menu is already in the selected module menu list or not//////
        if (this.TempModuleList[moduleIndex].tempMenuList.filter((tm: any) => tm.menuID == item.menuID).length == 0) {

          //////////////////// if the meny is not present already will push the new menu /////////////////////
          this.TempModuleList[moduleIndex].tempMenuList.push({
            menuID: item.menuID,
            menuTitle: item.menuTitle,
            c: item.c,
            r: item.r,
            u: item.u,
            d: item.d,
          })
        } else {

          /////////////////////// if the menu is already present than will update the selected meny of the selected Module
          var menuIndex = this.TempModuleList[moduleIndex].tempMenuList.findIndex((tm: any) => tm.menuID == item.menuID);

          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].c = item.c;
          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].r = item.r;
          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].u = item.u;
          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].d = item.d;
        }




      }
    }


  }



  ///////////////////////////////////////////////////////


  editRole(row: any) {
    // this.getMenuList();
    this.selectedModuleMenuList = [];
    this.TempModuleList = [];


    this.roleTitle = row.roleTitle;
    this.roleDescription = row.roleDescription;
    this.roleID = row.roleID;

    this.http.get(environment.mainApi + this.global.userLink + 'getrolemenu?roleid=' + row.roleID).subscribe((Response: any) => {
      // console.log(Response);

      var AllowedRolesList: any = [];

      Response.forEach((e: any) => {

        //// will replace the menu list crud fields by comparing with response //////////

        var index = this.menuList.findIndex((obj: any) => obj.menuID == e.menuID);

        //console.log(e,index)
        if (index != -1) {
          this.menuList[index].c = e.c;
          this.menuList[index].r = e.r;
          this.menuList[index].u = e.u;
          this.menuList[index].d = e.d;
          if (e.c && e.r && e.u && e.d) {
            this.menuList[index].a = true;
          }
        }

        //////////////// will push the data to allowedRolesList for Temporary Use ///////////

        AllowedRolesList.push(this.menuList.find((j: any) => j.menuID == e.menuID));

      });


      //////////////////// will push the allowedRolesList data to TempModuleList /////////////////

      AllowedRolesList.forEach((e: any) => {


        ////////////// will Search Whether the menu Module Already Present in tempModuleList or not //////////////
        if (this.TempModuleList.filter((tmd: any) => tmd.moduleID == e.moduleID).length == 0) {

          ////////  if module already not present then push the data to tempModule List

          this.TempModuleList.push({
            moduleID: e.moduleID,
            moduleTitle: this.moduleList[this.moduleList.findIndex((mod: any) => mod.moduleID == e.moduleID)].moduleTitle,
            tempMenuList: [{ menuID: e.menuID, menuTitle: e.menuTitle, c: e.c, r: e.r, u: e.u, d: e.d, }]
          })

        } else {

          ///// if Module already present in TempModuleList Array then will find the index of module//////

          var moduleIndex = this.TempModuleList.findIndex((md: any) => md.moduleID == e.moduleID);

          //////////// will push the data to the tempModule List by moduleIndex

          this.TempModuleList[moduleIndex].tempMenuList.push({
            menuID: e.menuID,
            menuTitle: e.menuTitle,
            c: e.c,
            r: e.r,
            u: e.u,
            d: e.d,
          })

        }



      });


    }
    )



    //console.log(this.TempModuleList); 

    this.btnType = 'Update';
    this.tabIndex = 0;

  }




  ////////////////////////////////////////////////////////


  deleteRole(row: any) {


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
            this.http.post(environment.mainApi + this.global.userLink + 'deleterole', {
              PinCode: pin,
              RoleID: row.roleID,
              UserID: this.global.getUserID()
            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getSavedRoles();
                  this.app.stopLoaderDark()
                } else {
                  this.msg.WarnNotify(Response.msg);
                  this.app.stopLoaderDark()
                }
              }
            )
          }
        });
      }

    })




  }




  ////////////////////////////////////////////////////////


  changeTabHeader(tabNum: any) {
    this.tabIndex = tabNum;
  }


  ////////////////////////////////////////////////////

  reset() {
    this.btnType = 'Save';
    this.roleTitle = '';
    this.roleDescription = '';
    this.getMenuList();
    this.TempModuleList = [];
    this.selectedModuleMenuList = [];

  }

  SelectAllMenu(type: any) {
    if (type == 'select') {
      if (this.TempModuleList.filter((m: any) => m.moduleID == this.moduleID).length == 0) {

        this.TempModuleList.push({
          moduleID: this.moduleID,
          moduleTitle: this.moduleList[this.moduleList.findIndex((mod: any) => mod.moduleID == this.moduleID)].moduleTitle,
          tempMenuList: [],
        });

        var index = this.TempModuleList.findIndex((e: any) => e.moduleID == this.moduleID);
        this.TempModuleList[index].tempMenuList = [];
        this.menuList.forEach((e: any) => {
          if (e.moduleID == this.moduleID) {
            e.c = true;
            e.r = true;
            e.u = true;
            e.d = true;
            e.a = true;
            this.TempModuleList[index].tempMenuList.push({ menuID: e.menuID, menuTitle: e.menuTitle, c: e.c, r: e.r, u: e.u, d: e.d, })
          }

        });
      } else {

        var index = this.TempModuleList.findIndex((e: any) => e.moduleID == this.moduleID);
        this.TempModuleList[index].tempMenuList = [];
        this.menuList.forEach((e: any) => {
          if (e.moduleID == this.moduleID) {




            e.c = true;
            e.r = true;
            e.u = true;
            e.d = true;
            e.a = true;
            this.TempModuleList[index].tempMenuList.push({ menuID: e.menuID, menuTitle: e.menuTitle, c: e.c, r: e.r, u: e.u, d: e.d, })
          }

        });
      }
    }

    if (type == 'unselect') {
      var index = this.TempModuleList.findIndex((e: any) => e.moduleID == this.moduleID);
      this.TempModuleList.splice(index, 1);
      this.menuList.forEach((e: any) => {
        if (e.moduleID == this.moduleID) {
          e.c = false;
          e.r = false;
          e.u = false;
          e.d = false;
          e.a = false;
        }
      });

    }
  }

}
