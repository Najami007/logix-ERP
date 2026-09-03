import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {

    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Rout');
    this.getRoutes();
  }



  routeTitle: any;
  routeID: any;
  description: any;
  actionbtn = 'Save';
  txtSearch: any;

  departmentList: any = [];












  save() {

    if (this.routeTitle == '' || this.routeTitle == undefined) {
      this.msg.WarnNotify('Enter Rout Name')
    } else {
      if (this.actionbtn == 'Save') {
        this.insert('insert', '');
      } else if (this.actionbtn == 'Update') {

        this.globaldata.openPinCode().subscribe(pin => {

          if (pin != '') {
            this.insert('update', pin);
          }
        }

        )
      }
    }
  }


  insert(type: any, pin: any) {

    var postData = {
      PinCode: pin,
      RouteID: this.routeID,
      RouteTitle: this.routeTitle,
      UserID: this.globaldata.getUserID()
    }

    var url = type == 'insert' ? 'insertroute' : 'updateroute'
    $(".loaderDark").show()
    this.http.post(environment.mainApi + this.globaldata.inventoryLink + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getRoutes();
          this.reset();
          $(".loaderDark").fadeOut(500);

        } else {
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )

  }




  reset() {
    this.routeTitle = '';
    this.description = '';
    this.actionbtn = 'Save';
  }






  getRoutes() {
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + 'getroute').subscribe(
      (Response) => {
        this.departmentList = Response;
      },
      (Error) => {
        this.msg.WarnNotify('Error Occured')
      }
    )
  }


  edit(row: any) {
    this.routeID = row.routeID
    this.routeTitle = row.routeTitle;
    this.description = row.routeDescription;
    this.actionbtn = 'Update';
  }


  delete(row: any) {

    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {

        this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'deleteroute', {
          PinCode: pin,
          RouteID: row.routeID,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Deleted Successfully') {
              this.msg.SuccessNotify(Response.msg);

              this.getRoutes();
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

}
