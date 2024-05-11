import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.scss']
})
export class AddFeatureComponent implements OnInit {


  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddFeatureComponent>,
    public global: GlobalDataModule,
    private msg: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dataServie: SharedServicesDataModule,
  ) { }

  ngOnInit(): void {
    if (this.editData) {
      this.btnType = 'Update';
      this.FeatureTitle = this.editData.featureTitle;
      this.FeatureDescription = this.editData.featureDescription;
    }
  }

  UserID = this.global.getUserID();
  btnType = 'Save';
  FeatureTitle: any = '';
  FeatureDescription: any = '';


  Save() {

    if (this.FeatureTitle == '' || this.FeatureTitle == undefined) {
      this.msg.WarnNotify('Enter Feature Title')
    } else if (this.FeatureDescription == '' || this.FeatureDescription == undefined) {
      this.msg.WarnNotify('Enter Feature Description')
    } else {

      if (this.btnType == 'Save') {

        this.dataServie.saveHttp(this.global.companyLink + 'insertFeatures', {
          FeatureTitle: this.FeatureTitle,
          FeatureDescription: this.FeatureDescription,
          UserID: this.UserID,
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
        this.dataServie.saveHttp(this.global.companyLink + 'updateFeatures', {
          FeatureID: this.editData.featureID,
          FeatureTitle: this.FeatureTitle,
          FeatureDescription: this.FeatureDescription,
          UserID: this.UserID,
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
