import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddFinishedItemComponent } from './add-finished-item/add-finished-item.component';
import { environment } from 'src/environments/environment.development';
import { error } from 'jquery';


@Component({
  selector: 'app-item-production',
  templateUrl: './item-production.component.html',
  styleUrls: ['./item-production.component.scss']
})
export class ItemProductionComponent {



  apiReq = environment.mainApi + this.global.manufacturingLink;

  crudList: any = { c: true, r: true, u: true, d: true };

  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
    this.getSavedData();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSavedData();
  }

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private global: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Item Production');
    this.getSavedData();

    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }




  add() {

    this.dialogue.open(AddFinishedItemComponent, {
      width: '90%',
    }).afterClosed().subscribe(value => {
      if (value == 'update') {
        this.getSavedData();
      }
    })

  }


  savedDataList: any = [];

  getSavedData() {

    this.http.get(this.apiReq + 'GetAllMnuItems').subscribe(
      {
        next: (Response: any) => {
          this.savedDataList = Response;
        },
        error: error => {
          console.log(error);
        }
      }
    )

  }


  editItem(item: any) {
    this.dialogue.open(AddFinishedItemComponent, {
      width: '90%',
      
      hasBackdrop:false,
      data:item,
    }).afterClosed().subscribe(value => {
      if (value == 'update') {
        this.getSavedData();
      }
    })


  }



  deleteItem(item: any) {

    var postData = {
      MnuItemID: item.mnuItemID,
      UserID: this.global.getUserID(),
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin !== '') {

        postData['PinCode'] = pin;
        this.http.post(this.apiReq + 'DeleteMnuItem', postData).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Data Deleted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getSavedData();
              } else {
                this.msg.WarnNotify(Response.msg)
              }

            },
            error: error => {
              console.log(error);
            }
          }
        )

      }
    })



  }


  ApproveItem(item: any) {

    var postData = {
      MnuItemID: item.mnuItemID,
      ApprovedStatus: !item.approvedStatus,
      UserID: this.global.getUserID(),
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin !== '') {

        postData['PinCode'] = pin;
        this.http.post(this.apiReq + 'ApproveMnuItem', postData).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Approved Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getSavedData();
              } else {
                this.msg.WarnNotify(Response.msg)
              }

            },
            error: error => {
              console.log(error);
            }
          }
        )

      }
    })



  }

  ActiveItem(item: any) {

    var postData = {
      MnuItemID: item.mnuItemID,
      ActiveStatus: !item.activeStatus,
      UserID: this.global.getUserID(),
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin !== '') {

        postData['PinCode'] = pin;
        this.http.post(this.apiReq + 'ActiveMnuItem', postData).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Data Updated Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getSavedData();
              } else {
                this.msg.WarnNotify(Response.msg)
              }

            },
            error: error => {
              console.log(error);
            }
          }
        )

      }
    })



  }

}
