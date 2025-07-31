import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { SaleBillPrintComponent } from '../SaleComFiles/sale-bill-print/sale-bill-print.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-sale-vehicle',
  templateUrl: './sale-vehicle.component.html',
  styleUrls: ['./sale-vehicle.component.scss']
})
export class SaleVehicleComponent {


  @ViewChild(SaleBillPrintComponent) billPrint: any;
  disableDate = this.global.DisableDateSale;
  discFeature = this.global.discFeature;
  BookerFeature = this.global.BookerFeature;
  gstFeature = this.global.gstFeature;
  customerFeature = this.global.customerFeature;
  tillOpenFeature = this.global.tillOpenFeature;
  editSpFeature = this.global.editSpFeature;
  editDiscFeature = this.global.editDiscFeature;
  prodDetailFeature = this.global.prodDetailFeature;
  BankShortCutsFeature = this.global.BankShortCutsFeature;
  FBRFeature = this.global.FBRFeature;
  LessToCostFeature = this.global.LessToCostFeature;
  changePaymentMehtodFeature = this.global.changePaymentMehtodFeature;
  onlySaveBillFeature = this.global.onlySaveBillFeature;

  postBillFeature = this.global.postSale;
  urduBillFeature = this.global.urduBill;
  disablePrintPwd = this.global.DisablePrintPwd;
  VehicleSaleFeature = this.global.VehicleSaleFeature;




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


    ///////////// will Check day is opened or not


    this.global.getCurrentOpenDay().subscribe(
      (Response: any) => {
        // alert(Response)
        if (Response == null || Response == '') {
          Swal.fire({
            title: 'Alert!',
            text: 'Day Is Currently Closed',
            position: 'center',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
          })
        }
      }
    )

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale');
    this.getVehicles();

    this.getProducts();
    this.getSavedData();
  }

  VehicleContact: any = '';
  VehicleBalance: any = '';
  invDate: any = new Date();
  productID: any = 0;
  vehicleID: any = 0;
  meterReading: any = '';
  VehicleBillNo: any = '';


  tmpVehicleID: any = 0;
  projectID = this.global.getProjectID();
  bookerID: any = 0;
  billRemarks: any = '';
  subTotal: any = 0;
  discount: any = 0;
  offerDiscount: any = 0;
  otherCharges: any = 0;
  netTotal: any = 0;
  cash: any = 0;
  change: any = 0;
  paymentType: any = 'Cash';


  productList: any = [];
  getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
  }


  saleDetailList: any = [];

  searchProduct(productID: any) {
    this.global.getProdDetail(productID, '').subscribe(
      (Response: any) => {
        this.pushProdData(Response[0])
      }
    )
    this.app.stopLoaderDark();

  }

  pushProdData(data: any) {
    this.saleDetailList = [];
    this.saleDetailList.push({
      productID: data.productID,
      productTitle: data.productTitle,
      barcode: data.barcode,
      flavourTitle: data.flavourTitle,
      productImage: data.productImage,
      quantity: 1,
      wohCP: data.costPrice,
      avgCostPrice: data.avgCostPrice,
      costPrice: data.costPrice,
      salePrice: data.salePrice,
      ovhPercent: 0,
      ovhAmount: 0,
      expiryDate: this.global.dateFormater(new Date(), '-'),
      batchNo: '-',
      batchStatus: '-',
      uomID: data.uomID,
      gst: 0,
      et: data.et,
      packing: data.packing,
      discInP: 0,
      discInR: 0,
      aq: data.aq,
      total: 0,
      productDetail: '',

    });

    this.subTotal = data.salePrice;
    this.netTotal = this.subTotal;
    this.cash = this.subTotal;
    this.change = 0;
    console.log(this.saleDetailList);


  }




  vehicleList: any = [];
  getVehicles() {
    this.http.get(environment.mainApi + 'veh/GetActiveVehicle').subscribe(
      (Response: any) => {
        this.vehicleList = Response;
      }
    )
  }

  onVehicleSelection() {
    this.VehicleContact = this.vehicleList.filter((e: any) => this.vehicleID == e.vehicleID)[0].contactNo;
  }




  ///////////////////////// For Adding New Vehicle Shortcut /////////////

  @ViewChild('vehicle') myVehicle: any;
  addVehicle() {
    setTimeout(() => {
      this.myVehicle.close()

    }, 200);

    this.global.openBootstrapModal('#addVehicleModal', true);

  }

  closeVehicleModal() {
    this.global.closeBootstrapModal('#addVehicleModal', true);
  }




  isValidSale = true;
  save() {

    if (this.isValidSale == true) {


      if (this.vehicleID == 0) {
        this.msg.WarnNotify('Select Vehicle');
        return;
      }

      if (this.productID == 0) {
        this.msg.WarnNotify('No Product Seleted');
        return;
      }

      if (this.VehicleBillNo == '') {
        this.msg.WarnNotify('Enter Bill No');
        return;
      }
      if (this.meterReading == '') {
        this.msg.WarnNotify('Enter Meter Reading');
        return;
      }

      if (this.VehicleBalance == '') {
        this.msg.WarnNotify('Enter Balance Amount');
        return;
      }




      var postData: any = {
        InvDate: this.global.dateFormater(this.invDate, '-'),
        PartyID: 0,
        InvType: "S",
        ProjectID: this.projectID,
        BookerID: this.bookerID,
        PaymentType: this.paymentType,
        SendToFbr: false,
        PosFee: 0,
        Remarks: this.billRemarks || '-',
        OrderType: "Take Away",
        BillTotal: this.subTotal,
        BillDiscount: Number(this.discount) + Number(this.offerDiscount),
        OtherCharges: this.otherCharges,
        NetTotal: this.netTotal,
        CashRec: this.cash,
        Change: this.change,
        AdvTaxAmount: 0,
        AdvTaxValue: 0,
        BankCoaID: 0,
        BankCash: 0,
        CusContactNo: '-',
        CusName: '-',
        SaleDetail: JSON.stringify(this.saleDetailList),
        VehicleID: this.vehicleID,
        MeterReading: this.meterReading || '0',
        VehicleContact: this.VehicleContact,
        VehicleBalance: this.VehicleBalance,
        VehicleBillNo: this.VehicleBillNo,
        UserID: this.global.getUserID()
      }


      console.log(postData);
      this.isValidSale = false;
      this.app.startLoaderDark();
      this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertCashAndCarrySale', postData).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.reset();
            this.getSavedData();
            this.msg.SuccessNotify(Response.msg);
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.isValidSale = true;
          this.app.stopLoaderDark();

        },
        (error: any) => {
          this.isValidSale = true;
          console.log(error);
          this.msg.WarnNotify('Unable to Save Check Connection');

          this.app.stopLoaderDark();
        }
      )
    }



  }


  print() {
    this.global.printData('#PrintDiv')
  }


  reset() {
    this.vehicleID = 0;
    this.invDate = new Date();
    this.productID = 0;
    this.saleDetailList = [];
    this.VehicleContact = '';
    this.VehicleBalance = '';
    this.VehicleBillNo = '';
    this.meterReading = '';
    this.subTotal = 0;
    this.netTotal = 0;
    this.change = 0;
    this.cash = 0;
    this.productID = 0;

  }


  curDate = new Date();
  fromDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1);;
  fromTime: any = '00:00';
  toDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 0);
  toTime: any = '23:59:59';
  savedDataList: any = [];
  getSavedData() {
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');


    var url = `GetVehicleSale?reqUserID=0&reqVehicleID=${this.tmpVehicleID}&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${this.fromTime}&ToTime=${this.toTime}`;

    this.app.startLoaderDark();
    this.http.get(environment.mainApi + 'veh/' + url).subscribe(
      (Response: any) => {
        this.savedDataList = [];
        if (Response.length == 0 || Response === null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }

        this.savedDataList = Response.map((e: any) => {
          (e.billDetails = JSON.parse(e.billDetail))
          return e;
        });
        console.log(Response);

        this.app.stopLoaderDark();
      },
      (Error: any) => {
        this.app.stopLoaderDark();
        console.log(Error);
      }
    )

  }



}
