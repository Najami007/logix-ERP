import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { error } from 'console';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent {
  @ViewChild('orderDetailPanel') orderDetailPanel!: MatSidenav;

  apiReq = environment.mainApi + this.global.mobileLink;
  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    // this.getProductList();
    // setTimeout(() => {
    //   this.filterProductList(this.filterType);
    // }, 500);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // this.getProductList();
    // setTimeout(() => {
    //   this.filterProductList(this.filterType);
    // }, 500);
  }

  goToPage(): void {
    // var count = this.productList.length / this.tableSize;
    // if (parseFloat(this.jumpPage) > count) {
    //   this.msg.WarnNotify('Invalid Value')
    //   return;
    // }

    if (this.jumpPage >= 1) {
      this.page = this.jumpPage;
      // this.getProductList();
      // setTimeout(() => {
      //   this.filterProductList(this.filterType);
      // }, 500);
    }
  }

  onProdSearchKeyup(e: any, value: any) {

    if (e.target.value.length == 0 && this.tmpPage == 0) {
      this.tmpPage = this.page;
      this.page = 1;
    }
    if (e.key == 'Backspace') {
      if (value.length == 1) {
        this.page = this.tmpPage;
        this.tmpPage = 0;
      }
    }


  }

  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    public global: GlobalDataModule,
    private app: AppComponent,
    private route: Router,
    private titleService: Title

  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })
  }



  ngOnInit(): void {
    this.getViewModeID();
    this.global.setHeaderTitle('Order Management');
    this.getSavedOrder();
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;

  }


  dataList: any = [
    { id: 1213212, orderNo: 465456, deliveryDate: new Date(), orderDate: new Date(), title: 'Najam Ali', Item: 4, amount: 4000, deliveryAddress: 'Kohat Road, Fateh Jang', status: 'Pending' },
    { id: 1213212, orderNo: 465456, deliveryDate: new Date(), orderDate: new Date(), title: 'Najam Ali', Item: 4, amount: 4000, deliveryAddress: 'Kohat Road, Fateh Jang', status: 'Processing' },
    { id: 1213212, orderNo: 465456, deliveryDate: new Date(), orderDate: new Date(), title: 'Najam Ali', Item: 4, amount: 4000, deliveryAddress: 'Kohat Road, Fateh Jang', status: 'Delivered' },
    { id: 1213212, orderNo: 465456, deliveryDate: new Date(), orderDate: new Date(), title: 'Najam Ali', Item: 4, amount: 4000, deliveryAddress: 'Kohat Road, Fateh Jang', status: 'Cancelled' },

  ]


  filterType: any = 'All';
  filterList: any = [
    { title: 'All' }, { title: 'Pending' }, { title: 'Processing' }, { title: 'Delivered' }, { title: 'Cancelled' },
  ]



  viewModeID = 1;
  setViewModeID(id: any) {
    this.viewModeID = id;
    localStorage.setItem('orderTableViewModeID', JSON.stringify(this.viewModeID));
    this.getViewModeID()
  }

  getViewModeID() {
    var value = localStorage.getItem('orderTableViewModeID');
    if (value !== null) {
      this.viewModeID = JSON.parse(value);
    }
  }

  curDate = new Date();
  fromDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1);
  toDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 0);
  fromTime = '00:00';
  toTime = '23:59';

  getSavedOrder() {

    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');
    var fromTime = this.fromTime;
    var toTime = this.toTime;

    var url = `${this.apiReq}GetMobOrders?MobUserID=0&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}&reqFilter=-`
    console.log(url)
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          this.dataList = Response;

        },
        error: error => {
          console.log(error);
        }
      }
    )
  }


  tmpOrderRow: any = [];
  SingleOrderDetail: any = [];

  OrderDetailTotal = 0;


  getSingleOrderDetail(orderNo: any) {

    var url = `${this.apiReq}GetSingleOrderDetail?OrderNo=${orderNo}`
    console.log(url)
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          this.SingleOrderDetail = Response;
          this.OrderDetailTotal = 0;
          if (Response.length > 0) {
            this.SingleOrderDetail.foreach((e:any)=>{
              this.OrderDetailTotal += e.salePrice * e.quantity;
            })

          }

        },
        error: error => {
          console.log(error);
        }
      }
    )

  }


  closePanel() {
    this.orderDetailPanel.close();
    this.tmpOrderRow = [];
    setTimeout(() => {
      this.scrollToRow(this.curFocusRow)
    }, 500);
  }

  curFocusRow = 0;

  openDetailPanel(item: any, e: any) {
    this.orderDetailPanel.open();
    e.preventDefault();
    this.tmpOrderRow = item;
    this.getSingleOrderDetail(item.orderNo);
  }



  scrollToRow(index: number) {
    const row = document.getElementById('order-' + index);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


}
