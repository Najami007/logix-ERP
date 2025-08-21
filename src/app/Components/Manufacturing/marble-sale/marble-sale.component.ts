import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { AddpartyComponent } from "src/app/Components/Company/party/addparty/addparty.component";
import { GlobalDataModule } from "src/app/Shared/global-data/global-data.module";
import { NotificationService } from "src/app/Shared/service/notification.service";
import { environment } from "src/environments/environment.development";



@Component({
  selector: 'app-marble-sale',
  templateUrl: './marble-sale.component.html',
  styleUrls: ['./marble-sale.component.scss']
})
export class MarbleSaleComponent implements OnInit {

  apiReq = environment.mainApi + this.global.manufacturingLink;

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
    this.getItemList();

  }


  PBarcode: any = '';
  productList: any = [];
  customerPreviousBalance: any = [];
  orderRefrence: any = '';
  partyID: any = 0;
  invoiceDate: any = new Date();
  partyList: any = [];


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


  itemList: any = [];

  getItemList() {

    this.http.get(this.apiReq + 'GetAllMnuItems').subscribe(
      {
        next: (Response: any) => {
          this.itemList = Response;
          // console.log(Response);
        },
        error: error => {
          console.log(error);
        }
      }
    )

  }


  rowFocused = -1;
  prodFocusedRow = 0;
  handleUpdown(item: any, e: KeyboardEvent, cls: string, index: number): void {
    const container = $(".table-logix");
    const key = e.keyCode;
    const isShiftTab = e.shiftKey && key === 9;

    // Tab key → Move focus to next row
    if (key === 9 && !e.shiftKey) {
      this.rowFocused = index + 1;
      return;
    }

    // Shift+Tab key → Move focus to previous row
    if (isShiftTab) {
      this.rowFocused = index - 1;
      return;
    }


    // Delete key → Remove the row
    if (key === 46) {
      this.delRow(item);
      this.rowFocused = 0;
      return;
    }

    // Arrow Down → Move to next row
    if (key === 40) {
      if (this.tableDataList.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.tableDataList.length - 1);
        const clsName = `${cls}${this.rowFocused}`;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select').trigger('focus');
      }
      return;
    }

    // Arrow Up → Move to previous row or focus search
    if (key === 38) {
      if (this.rowFocused > 0) {
        this.rowFocused--;
        const clsName = `${cls}${this.rowFocused}`;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select').trigger('focus');
      } else {
        e.preventDefault();
        $(".searchProduct").trigger('select').trigger('focus');
      }
      return;
    }

    // Allowable keys (numbers, arrows, delete, tab, enter, etc.)
    const allowedKeys = [
      8, 9, 13, 16, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110
    ];

    // Block any key not in allowedKeys
    if (!allowedKeys.includes(key)) {
      e.preventDefault();
    }
  }

  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {


    /////// increment in prodfocus on tab click
    if (e.keyCode == 9 && !e.shiftKey) {
      this.prodFocusedRow += 1;

    }
    /////// decrement in prodfocus on shift tab click
    if (e.shiftKey && e.keyCode == 9) {
      this.prodFocusedRow -= 1;

    }
    /////move down
    if (e.keyCode == 40) {


      if (prodList.length > 1) {
        this.prodFocusedRow += 1;
        if (this.prodFocusedRow >= prodList.length) {
          this.prodFocusedRow -= 1
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          e.preventDefault();
          $(clsName).trigger('focus');
          //  e.which = 9;   
          //  $(clsName).trigger(e)       
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        e.preventDefault();
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        e.preventDefault();
        $(clsName).trigger('focus');


      }

    }

  }

  changeFocus(e: any, cls: any) {

    if (e.target.value == '') {
      if (e.keyCode == 40) {

        if (this.tableDataList.length >= 1) {
          this.rowFocused = 0;
          e.preventDefault();
          $('.qty0').trigger('select');
          $('.qty0').trigger('focus');

        }
      }
    } else {
      this.prodFocusedRow = 0;
      /////move down
      if (e.keyCode == 40) {
        if (this.itemList.length >= 1) {
          $('.prodRow0').trigger('focus');
        }
      }
    }
  }



  delRow(item: any) {
    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {

          var index = this.tableDataList.indexOf(item);
          this.tableDataList.splice(index, 1);
          this.getTotal();

          if (index == 0) {
            $('#searchProduct').trigger('select');
            $('#searchProduct').trigger('focus');
          } else {
            this.rowFocused = index - 1;
            $('.qty' + this.rowFocused).trigger('select');
            $('.qty' + this.rowFocused).trigger('focus');
          }
        }
      }
    )



  }



  tableDataList: any = [];

  addMenuItem(item: any) {

    var index = this.tableDataList.findIndex((e: any) => e.mnuItemID == item.mnuItemID);

    if (index != -1) {
      this.tableDataList[index].quantity += 1;
      this.PBarcode = '';
      return;

    }


    this.tableDataList.push({ mnuItemID: item.mnuItemID, mnuItemTitle: item.mnuItemTitle, quantity: 1, salePrice: item.mnuItemSalePrice })

    this.PBarcode = '';


  }


  getTotal() {

  }






}

