import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';


@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddMenuComponent>,
    public global: GlobalDataModule,
    private msg: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dataServie: SharedServicesDataModule,
  ) { }
  ngOnInit(): void {
    this.getParentMenuList();
    this.getModuleList();
    if (this.editData) {
      this.btnType = 'Update';
      this.isParentMenu = this.editData.isParentMenu;
      this.serialNo = this.editData.serialNo;
      this.ParentMenuID = this.editData.parentMenuID;
      this.menuLink = this.editData.menuLink;
      this.menuTitle = this.editData.menuTitle;
      this.moduleID = this.editData.moduleID;
    }
    //console.log(this.editData.parentMenuID);
  }

  UserId = this.global.getUserID();
  btnType = 'Save';

  isParentMenu: boolean = false;
  serialNo: any = '';
  ParentMenuID: any = '';
  menuLink: string = '';
  menuTitle: string = '';
  moduleID: number = 0;

  moduleList: any = [];
  parentMenuList: any = [];

  getParentMenuList() {
    this.dataServie.getHttp(this.global.contorlPanelLink + 'getMenu', '').subscribe(
      (Response: any) => {
        this.parentMenuList = Response.filter((e: any) => e.isParentMenu == true);
        // console.log(this.parentMenuList);
      }
    )
  }

  getModuleList() {
    this.dataServie.getHttp(this.global.userLink + 'getModule', '').subscribe(
      (Response: any) => {
        this.moduleList = Response;
        // console.log(Response);
      }
    )
  }

  Save() {

    if (this.menuTitle == '' || this.menuTitle == undefined) {
      this.msg.WarnNotify('Enter Menu Title');
    } else if (this.moduleID == 0 || this.moduleID == undefined) {
      this.msg.WarnNotify('Select Module');
    } else if (this.menuLink == '' || this.menuLink == undefined && this.isParentMenu == false) {
      this.msg.WarnNotify('Enter Menu Link');
    }
    //else if(this.ParentMenuID == 0 || this.ParentMenuID == undefined && this.isParentMenu == false){
    // this.msg.WarnNotify('Select Parent Menu');
    //}
    else {

      if(this.isParentMenu == false){
        this.ParentMenuID = 0;
      }

      if (this.btnType == 'Save') {

        this.dataServie.saveHttp(this.global.contorlPanelLink + 'insertMenu', {
          ModuleID: this.moduleID,
          MenuTitle: this.menuTitle,
          SerialNo: this.serialNo,
          MenuLink: this.menuLink,
          IsParentMenu: this.isParentMenu,
          ParentMenuID: this.ParentMenuID,
          UserID: this.UserId,
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Saved Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.dialogRef.close('update');
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
      } else if (this.btnType == 'Update') {

        this.dataServie.saveHttp(this.global.contorlPanelLink + 'updateMenu', {
          MenuID: this.editData.menuID,
          ModuleID: this.moduleID,
          MenuTitle: this.menuTitle,
          SerialNo: this.serialNo,
          MenuLink: this.menuLink,
          IsParentMenu: this.isParentMenu,
          ParentMenuID: this.ParentMenuID,
          UserID: this.UserId,
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.dialogRef.close('update');
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
      }
    }



  }


  closeDialog() {
    this.dialogRef.close();
  }

}
