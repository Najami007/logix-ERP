import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { OrderPrintComponent } from './order-print/order-print.component';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent {
  @ViewChild('orderDetailPanel') orderDetailPanel!: MatSidenav;
  @ViewChild('orderDetailMobilePanel') orderDetailMobilePanel!: MatSidenav;

  @ViewChild(OrderPrintComponent) orderPrint: any;

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


  private subscription!: Subscription;



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
    this.getRiderList();
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;

    this.subscription = interval(3000).subscribe(() => {
      this.MatchOrderList();
    });

  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  curUserRoleID = this.global.getRoleTypeID();

  dataList: any = []


  filterType: any = 'All';
  filterList: any = [
    { title: 'All' }, { title: 'Pending' }, { title: 'Processing' }, { title: 'Dispatched' }, { title: 'Delivered' }, { title: 'Cancelled' },
  ]


  statusList: any = [
    { orderStatusID: 1, orderStatusTitle: 'Pending' },
    { orderStatusID: 2, orderStatusTitle: 'Processing' },
    { orderStatusID: 3, orderStatusTitle: 'Dispatched' },
    { orderStatusID: 4, orderStatusTitle: 'Delivered' },
    { orderStatusID: 5, orderStatusTitle: 'Cancelled' }
  ]


  getStatusColor(status: any) {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'processing':
        return '#1E90FF'; // Dodger Blue
      case 'dispatched':
        return '#800080'; // Purple
      case 'delivered':
        return '#28a745'; // Green
      case 'cancelled':
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Grey (for unknown status)
    }


  }


  riderList: any = []

  getRiderList() {
    this.http.get(environment.mainApi + this.global.mobileLink + 'GetMobUser').subscribe(
      {
        next: (Response: any) => {

          if (Response.length > 0) {
            this.riderList = Response.filter((e: any) => e.userType == 'Rider');
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }


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

  searchType = 'date';

  lastOrderNo = 0;
  MatchOrderList() {

    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');
    var fromTime = this.fromTime;
    var toTime = this.toTime;
    var url = `${this.apiReq}GetMobOrders?MobUserID=0&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}&reqFilter=ALL`
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          if (Response.length > 0) {

            if (this.lastOrderNo == 0 && Response.length > 0) {
              this.lastOrderNo = Response[0].orderNo;
              return;
            }

            if (Response.length > 0) {
              if (Response[0].orderNo > this.lastOrderNo) {
                this.RefreshAlert();
                this.lastOrderNo = Response[0].orderNo;
              }
            }



          }





        },
        error: error => {
          console.log(error);
        }
      }
    )

  }

  RefreshAlert() {
    Swal.fire({
      title: "New Order",
      text: "New Order Arrived Refresh List",
      icon: "warning",
      backdrop:true,
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Refresh"
    }).then((result) => {
      if (result.isConfirmed) {
        this.searchType = 'all';
        this.getSavedOrder();
      }
    });
  }

  getSavedOrder() {

    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');
    var fromTime = this.fromTime;
    var toTime = this.toTime;

    var reqFilter = this.searchType == 'all' ? 'All' : '-'
    this.app.startLoaderDark();
    var url = `${this.apiReq}GetMobOrders?MobUserID=0&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}&reqFilter=${reqFilter}`
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response);

          this.dataList = [];
          if (Response.length > 0) {

            this.dataList = this.filterType !== 'All'
              ? Response.filter((e: any) => e.orderStatus == this.filterType)
              : Response;
          }
          this.app.stopLoaderDark();

        },
        error: error => {
          this.app.stopLoaderDark();
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
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.SingleOrderDetail = Response;
          this.OrderDetailTotal = 0;
          if (this.SingleOrderDetail.length > 0) {
            this.SingleOrderDetail.forEach((e: any) => {
              this.OrderDetailTotal += (e.salePrice - e.discInR) * e.quantity;
            });

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
    this.orderDetailMobilePanel.close();
    this.tmpOrderRow = [];
    setTimeout(() => {
      this.scrollToRow(this.curFocusRow)
    }, 500);
  }

  curFocusRow = 0;

  openDetailPanel(item: any, e: any) {
    this.orderDetailPanel.open();
    this.orderDetailMobilePanel.open();
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


  selectedRowList: any = [];

  findSelectedRow() {
    this.selectedRowList = this.dataList.filter((e: any) => e.isChecked == true)
  }


  printOrder(item: any) {

    this.orderPrint.getSingleOrderDetail(item);

  }



  curSelectedRow: any = [];
  updateOrderStatus: any = '';
  updateStatusRemarks: any = '';

  openChangeStatusModal(item: any) {
    this.curSelectedRow = item;
    this.updateOrderStatus = item.orderStatus;
    this.updateStatusRemarks = item.remarks;
    this.global.openBootstrapModal('#ChangeStatus', true);

  }

  changeOrderStatus(item: any) {

    if (this.updateOrderStatus == 'Cancelled' && this.updateStatusRemarks == '') {
      this.msg.WarnNotify('Enter Cancellation Remarks');
      return;
    }

    if ((this.updateOrderStatus == 'Dispatched' || this.updateOrderStatus == 'Delivered') && item.riderID == 0) {
      this.msg.WarnNotify('Assign Order to the Rider First');
      return;
    }

    if (this.updateOrderStatus == this.curSelectedRow.orderStatus) {
      this.msg.WarnNotify(`Already Status is ${this.updateOrderStatus}`)
      return;
    }



    var postData: any = {
      OrderNo: item.orderNo,
      RiderID: item.riderID,
      OrderStatus: this.updateOrderStatus,
      Remarks: this.updateStatusRemarks || '-',
      UserID: this.global.getUserID()
    }


    this.app.startLoaderDark();
    this.http.post(this.apiReq + 'ChangeOrderStatus', postData).subscribe({
      next: (Response: any) => {
        if (Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getSavedOrder();
        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark()
        this.global.closeBootstrapModal('#ChangeStatus', true)
      },
      error: error => {
        this.msg.WarnNotify(error.error.msg);
        this.app.stopLoaderDark();
        console.log(error);
      }
    })

  }


  openRiderAssignModal(item: any) {

    if (item.orderStatus == 'Dispatched' || item.orderStatus == 'Delivered' || item.orderStatus == 'Cancelled') {
      return;
    }

    this.curSelectedRow = item;
    this.tmpRiderID = item.riderID;
    this.global.openBootstrapModal('#assignOrder', true);
  }

  tmpRiderID: any = 0;

  assignOrderToRider(item: any) {



    if (this.tmpRiderID == 0) {
      this.msg.WarnNotify('Select Rider')
      return;
    }

    var postData: any = {
      OrderNo: item.orderNo,
      RiderID: this.tmpRiderID,
      UserID: this.global.getUserID()
    }


    this.app.startLoaderDark();
    this.http.post(this.apiReq + 'OrderAssignToRider  ', postData).subscribe({
      next: (Response: any) => {
        if (Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getSavedOrder();
        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark()
        this.global.closeBootstrapModal('#assignOrder', true)
      },
      error: error => {
        this.app.stopLoaderDark();
        console.log(error);
      }
    })

  }


  reset() {

    this.curSelectedRow = [];
    this.tmpRiderID = 0;
    this.updateOrderStatus = '';
    this.updateStatusRemarks = '';
  }


  openImage(link: string) {
    if (link == '-' || link == null || link == '') {
      return;
    }
    window.open(link, '_blank');
  }


  openFilterModal() {
    this.global.openBootstrapModal('#filterModal', true);
  }

  applyFilter() {

  }

}
