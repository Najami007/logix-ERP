import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { AddpartyComponent } from "src/app/Components/Company/party/addparty/addparty.component";
import { GlobalDataModule } from "src/app/Shared/global-data/global-data.module";
import { NotificationService } from "src/app/Shared/service/notification.service";



@Component({
  selector: 'app-marble-sale',
  templateUrl: './marble-sale.component.html',
  styleUrls: ['./marble-sale.component.scss']
})
export class MarbleSaleComponent implements OnInit {


  companyProfile: any = [];
  companyLogo: any = '';
  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  crudList: any = { c: true, r: true, u: true, d: true };


  mobileMask = this.global.mobileMask;

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialog: MatDialog,
    private app: AppComponent,
    private route: Router
  ) {



    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
    });

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale');

  }


  PBarcode:any ='';
  productList:any = [];
  customerPreviousBalance:any = [];
  orderRefrence:any = '';
  partyID:any = 0;
  invoiceDate:any = new Date();
  partyList:any = [];


   getPartyList() {
    this.global.getCustomerList().subscribe((data: any) => { this.partyList = data; });
  }




  @ViewChild('customer') myParty: any;
    addParty() {
      setTimeout(() => {
        this.myParty.close()
      }, 200);
      this.dialog.open(AddpartyComponent, {
        width: "50%"
      }).afterClosed().subscribe(value => {
        if (value == 'Update') {
          this.getPartyList();
        }
      });
    }




}

