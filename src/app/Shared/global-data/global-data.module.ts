import { Injectable, NgModule, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { userInterface } from '../Interfaces/login-user-interface';
import { BehaviorSubject, Observable, Observer, from, map, of, retry, switchMap } from 'rxjs';
import * as $ from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { ProductImgComponent } from 'src/app/Components/Inventory/product/product-img/product-img.component';
import { PincodeComponent } from 'src/app/Components/User/pincode/pincode.component';

import { CookieService } from 'ngx-cookie-service';
import { ConfirmationAlertComponent } from 'src/app/Components/Common/confirmation-alert/confirmation-alert.component';
import * as bootstrap from 'bootstrap';
import { ExcelExportService } from '../service/ExcelExportService/excel-export.service';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';
import { UpdateSubscriptionComponent } from 'src/app/Components/User/update-subscription/update-subscription.component';
import { SubscriptionKeyGeneratorComponent } from 'src/app/Components/User/subscription-key-generator/subscription-key-generator.component';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QRCodeModule
  ]
})

@Injectable({
  providedIn: 'root'
})

export class GlobalDataModule implements OnInit {

  thankyouImage = '../../assets/Images/thankyou.png';
  DisableDate = false;
  disableSaleDate = true;


  ///////////////Rest Service Charges Condition //////////
  // RestServiceCharges = 0;
  RestServiceCharges = this.getServiceCharges();  //////////// Jazeerra Food Service Charges
  validCharges(billTotal: any) {
    // if (billTotal > 3000) { ////////// Jazeera Foods Condition
    if (billTotal > 0) { ////////// Cake Corner Refreshment
      return true;
    } else {
      return false;
    }
  }


  ////////////////////////


  ResCardGst = 5; // this.getCardGst();
  ResCashGst = 16; // this.getCashGst();
  POSFee = this.getPosFee();
  InvProjectID = 1;
  parkProjectID = 6;

  ////////////////////// API Module Start Points//////////////////

  inventoryLink = 'inv/';
  userLink = 'user/';
  accountLink = 'acc/';
  companyLink = 'cmp/';
  contorlPanelLink = 'cpl/';
  coreLink = 'core/';
  parkLink = 'park/';
  restaurentLink = 'res/';
  societyLink = 'prp/';
  propertyLink = 'prp/';
  manufacturingLink = 'mnu/';
  mobileLink = 'mob/';

  ////////////////////// API Module Start Points//////////////////
  Currency = 'AED';


  glbMenulist: any = [];


  /////////////// Pagination Global Size ///////////////
  paginationDefaultTalbeSize = 50;
  paginationTableSizes: any = [10, 25, 50, 100, 500, 1000];

  /////////////// Pagination Global Size ///////////////




  public subject = new Subject<any>();
  public comapnayProfile = [];
  public currentUserSubject: BehaviorSubject<userInterface>;
  public currentUser: Observable<userInterface>;
  curUserID: any;


  constructor(
    private http: HttpClient,
    private rout: Router,
    private msg: NotificationService,
    private dialog: MatDialog,
    private cookie: CookieService,
    public ExportExcel: ExcelExportService,
    public datePipe: DatePipe

    // public app: AppComponent,

  ) {



    this.currentUserSubject = new BehaviorSubject<userInterface>(
      JSON.parse(localStorage.getItem('curVal') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }


  ngOnInit(): void {


  }


  private _headerTitleSource = new Subject<string>();
  header_title$ = this._headerTitleSource.asObservable();

  private _moduleTitleSource = new Subject<string>();
  module_title$ = this._moduleTitleSource.asObservable();


  //////////////sets the header title ////////////////////////
  setHeaderTitle(title: string) {
    this._headerTitleSource.next(title.toUpperCase());
  }

  //////////////sets the header title ////////////////////////
  setModuleTitle(title: string) {
    this._moduleTitleSource.next(title.toUpperCase());
  }



  ///////////////////////////////////////////////////////////
  /////////////////////login funciton///////////////////////
  ////////////////////////////////////////////////////////




  login(Email: String, password: string) {
    $('.loaderDark').show();

    this.http.post(environment.mainApi + 'user/_userLogin', {
      LoginName: Email,
      Password: password,
    }).subscribe({
      next: (Response: any) => {
        var curDate: Date = new Date();
        var userID = Response._culId;



        if (Response.msg == 'Logged in Successfully') {

          var value = {
            msg: Response.msg,
            _cuLnk: Response._cuLnk,
            _culId: Response._culId,
            _culName: Response._culName,
            _reqCID: Response._reqCID,
            _reqSCID: Response._reqSCID,
            _reqCrG: Response._reqCrG,
            _reqCsG: Response._reqCsG,
            _reqPrjID: Response._reqPrjID,
            _reqRTID: Response._reqRTID,
          };
          var flt: any = [];
          ///Encripting The Features List
          if (Response._reqFeatures) {
            Response._reqFeatures.forEach((e: any) => {
              flt.push({ ttl: btoa(btoa(e.featureTitle)), sts: btoa(btoa(e.featureStatus)) });
            });
          }


          localStorage.setItem('curVal', JSON.stringify({ value }));
          localStorage.setItem('ftr', JSON.stringify({ flt }));





          this.http.get(environment.mainApi + 'user/getusermodule?userid=' + parseInt(atob(atob(value._culId)))).subscribe(
            (Response: any) => {

              localStorage.setItem('mid', JSON.stringify(Response[0].moduleID));
              sessionStorage.setItem('mid', JSON.stringify(Response[0].moduleID));
              this.setMenuItem(Response[0].moduleID);
            }
          )
          this.getCompany();
          this.refreshFeatures();


          this.rout.navigate(["home"]);
          $('.loaderDark').fadeOut(500);


        } else {
          this.msg.WarnNotify(Response.msg);
          $('.loaderDark').fadeOut(500);
        }
      },
      error: error => {

        this.msg.WarnNotify('Error Occurred While Login Process')
        $('.loaderDark').fadeOut(500);
      }
    })

    // this.rout.navigate(["home"]);
    // $('.loaderDark').fadeOut(500);


  }


  ////////////////////////////////////////////////////
  /////////////funtion to keep user log out/////////////////////
  ///////////////////////////////////////////////////////////


  logout() {
    $('.loaderDark').show();
    this.http.post(environment.mainApi + 'user/_userLogout', {
      UserID: this.getUserID(),
    }).subscribe(
      (Response: any) => {
        if (Response.msg = 'Logged Out Successfully') {
          // this.msg.SuccessNotify(Response.msg);


          localStorage.removeItem('curVal');
          localStorage.removeItem('ftr');
          localStorage.removeItem('mid');

          // localStorage.clear();

          // localStorage.removeItem('cmpnyVal');
          window.location.reload();
          // this.rout.navigate(['login']);
          $('.loaderDark').fadeOut(500);
        } else {
          this.msg.WarnNotify(Response.msg);
          $('.loaderDark').fadeOut(500);
        }

      },
      (Error) => {
        this.msg.WarnNotify('Error Occured Check Connection!');
        $('.loaderDark').fadeOut(500);
      }
    )

  }




  /////////////////////// Features Section //////////////////////////////

  discFeature = this.getFeature('Discount');
  BookerFeature = this.getFeature('Booker');
  gstFeature = this.getFeature('GST');
  customerFeature = this.getFeature('Customer');
  tillOpenFeature = this.getFeature('TillOpen');
  editSpFeature = this.getFeature('EditSp');
  editDiscFeature = this.getFeature('EditDisc');
  prodDetailFeature = this.getFeature('ProdDetail');
  showCmpNameFeature: any = this.getFeature('CmpName');
  showCompanyLogo = this.getFeature('CmpLogo');
  waiterFeature = this.getFeature('Waiter');
  AutoFillNameFeature = this.getFeature('AutoFillName');
  BankShortCutsFeature = this.getFeature('BankShortCuts');
  FBRFeature = this.getFeature('FBR');
  showOrderNo = this.getFeature('OrderNo');
  printKot = this.getFeature('PrintKot');
  serviceChargeFeature = this.getFeature('ServiceCharges');
  LessToCostFeature = this.getFeature('lessToCost');
  BillFormate1Feature = this.getFeature('billFormat1');
  BillFormate2Feature = this.getFeature('billFormat2');
  RestSimpleSaleFeature = this.getFeature('RestSimpleSale');
  changePaymentMehtodFeature = this.getFeature('chngPayMtd');
  onlySaveBillFeature = this.getFeature('OnlySave');
  coverOfFeature = this.getFeature('CoverOf');
  DisableDateSale = this.getFeature('showDateSale');
  DisableDateAcc = this.getFeature('showDateAcc');
  DefaultOrderType = this.getFeature('DefaultOrderType');
  DisableDiscPwd = this.getFeature('DisableDiscPwd');
  DisablePrintPwd = this.getFeature('DisablePrintPwd');
  AutoTableSelect = this.getFeature('AutoTableSelect');
  postSale = this.getFeature('postSale');
  urduBill = this.getFeature('UrduPrint');
  CommentCard = this.getFeature('CommentCard');
  DisableInvDate = this.getFeature('DisableInvDate');
  RestBillUserwise = this.getFeature('RestBillUserwise');
  VehicleSaleFeature = this.getFeature('VehicleSale');
  DetailedPurchase = this.getFeature('DetailedPurchase');
  PinCodeFeature = this.getFeature('PinCode');
  MultiBarcode = this.getFeature('MultiBarcode');
  TabletPrintFeature = this.getFeature('TabletPrint');
  ManufacturingFeature = this.getFeature('Manufacturing');
  CustomSaleGstFeature = this.getFeature('CustomSaleGst');
  northEdgeEnterPriseBillFeature = this.getFeature('northEdgeEnterPriseBill');
  disableDOCPwdFeature = this.getFeature('disableDOCPwd');
  showSaleAQFeature = this.getFeature('showSaleAQ');
  showSaleCPFeature = this.getFeature('showSaleCP');
  PrintKotAreawiseFeature = this.getFeature('PrintKotAreawise');
  FurnitureSaleFeature = this.getFeature('FurnitureSale');
  DisableDineInKotPrintFeature = this.getFeature('DisableDineInKotPrint');
  dashSlashBarcodeFeature = this.getFeature('dashSlashBarcode');
  CusDiscFeature = this.getFeature('CusDisc');
  appConfigFeature = this.getFeature('appConfig');
  ImageUrlFeature = this.getFeature('ImageUrl');
  SaleSupplierFeature = this.getFeature('SaleSupplier');
  AttachDocPurchaseFeature = this.getFeature('AttachDocPurchase');
  NotificationFeature = this.getFeature('Notification');
  insertLocalStorageFeature = this.getFeature('insertLocalStorage');
  showLogixDetailFeature = this.getFeature('showLogixDetail');
  refreshFeatures() {
    this.discFeature = this.getFeature('Discount');
    this.BookerFeature = this.getFeature('Booker');
    this.gstFeature = this.getFeature('GST');
    this.customerFeature = this.getFeature('Customer');
    this.tillOpenFeature = this.getFeature('TillOpen');
    this.editSpFeature = this.getFeature('EditSp');
    this.editDiscFeature = this.getFeature('EditDisc');
    this.prodDetailFeature = this.getFeature('ProdDetail');
    this.showCmpNameFeature = this.getFeature('CmpName');
    this.showCompanyLogo = this.getFeature('CmpLogo');
    this.waiterFeature = this.getFeature('Waiter');
    this.AutoFillNameFeature = this.getFeature('AutoFillName');
    this.BankShortCutsFeature = this.getFeature('BankShortCuts');
    this.FBRFeature = this.getFeature('FBR');
    this.showOrderNo = this.getFeature('OrderNo');
    this.printKot = this.getFeature('PrintKot');
    this.serviceChargeFeature = this.getFeature('ServiceCharges');
    this.LessToCostFeature = this.getFeature('lessToCost');
    this.BillFormate1Feature = this.getFeature('billFormat1');
    this.BillFormate2Feature = this.getFeature('billFormat2');
    this.RestSimpleSaleFeature = this.getFeature('RestSimpleSale');
    this.changePaymentMehtodFeature = this.getFeature('chngPayMtd');
    this.onlySaveBillFeature = this.getFeature('OnlySave');
    this.coverOfFeature = this.getFeature('CoverOf');
    this.DisableDateSale = this.getFeature('showDateSale');
    this.DisableDateAcc = this.getFeature('showDateAcc');
    this.DefaultOrderType = this.getFeature('DefaultOrderType');
    this.DisableDiscPwd = this.getFeature('DisableDiscPwd');
    this.DisablePrintPwd = this.getFeature('DisablePrintPwd');
    this.AutoTableSelect = this.getFeature('AutoTableSelect');
    this.postSale = this.getFeature('postSale');
    this.urduBill = this.getFeature('UrduPrint');
    this.CommentCard = this.getFeature('CommentCard');
    this.DisableInvDate = this.getFeature('DisableInvDate');
    this.RestBillUserwise = this.getFeature('RestBillUserwise');
    this.VehicleSaleFeature = this.getFeature('VehicleSale');
    this.DetailedPurchase = this.getFeature('DetailedPurchase');
    this.PinCodeFeature = this.getFeature('PinCode');
    this.MultiBarcode = this.getFeature('MultiBarcode');
    this.TabletPrintFeature = this.getFeature('TabletPrint');
    this.ManufacturingFeature = this.getFeature('Manufacturing');
    this.CustomSaleGstFeature = this.getFeature('CustomSaleGst');
    this.northEdgeEnterPriseBillFeature = this.getFeature('northEdgeEnterPriseBill');
    this.disableDOCPwdFeature = this.getFeature('disableDOCPwd');
    this.showSaleAQFeature = this.getFeature('showSaleAQ');
    this.showSaleCPFeature = this.getFeature('showSaleCP');
    this.PrintKotAreawiseFeature = this.getFeature('PrintKotAreawise');
    this.FurnitureSaleFeature = this.getFeature('FurnitureSale');
    this.DisableDineInKotPrintFeature = this.getFeature('DisableDineInKotPrint');
    this.dashSlashBarcodeFeature = this.getFeature('dashSlashBarcode');
    this.CusDiscFeature = this.getFeature('CusDisc');
    this.appConfigFeature = this.getFeature('appConfig');
    this.ImageUrlFeature = this.getFeature('ImageUrl');
    this.SaleSupplierFeature = this.getFeature('SaleSupplier');
    this.AttachDocPurchaseFeature = this.getFeature('AttachDocPurchase');
    this.NotificationFeature = this.getFeature('Notification');
    this.insertLocalStorageFeature = this.getFeature('insertLocalStorage');
    this.showLogixDetailFeature = this.getFeature('showLogixDetail');
  }


  getFeature(value: any) {

    var credentials = JSON.parse(localStorage.getItem('ftr') || '""');
    var returnStatus = false;
    if (credentials != '') {

      var FearturesList: any = credentials.flt;

      var row: any = FearturesList.find((e: any) => atob(atob(e.ttl)) == value);
      if (row != undefined) {
        var status: any = atob(atob(row.sts));
        returnStatus = status == 'True' ? true : false
      }

    }
    return returnStatus;

  }


  /////////////////////////////////////////////////////////////
  ///////////// Pagination Settings  //////////////////////////////////////////////




  page: number = 1;
  count: number = 0;

  tableSize: number = 25;
  tableSizes: any = [10, 25, 50, 100];
  jumpPage: any = 0;

  onTableDataChange(event: any, callFunc: any) {

    this.page = event;
    callFunc();
  }

  onTableSizeChange(event: any, callFunc: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    callFunc();
  }

  goToPage(List: any, callFunc: any): void {
    var count = List.length / this.tableSize;
    if (parseFloat(this.jumpPage) > count) {
      this.msg.WarnNotify('Invalid Value')
      return;
    }

    if (this.jumpPage >= 1) {
      this.page = this.jumpPage;
      callFunc();
    }
  }

  /////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////

  getBillPrintType() {
    var value = '';
    var credentials = localStorage.getItem('BillPrint');
    if (credentials == null) {
      value = 'english';
    } else {
      value = credentials;
    }

    return value;
  }



  getModuleList(): Observable<any> {
    return this.http.get(environment.mainApi + this.userLink + 'getusermodule?userid=' + this.getUserID()).pipe(retry(3))
  }





  getKOTApproval() {
    return JSON.parse(localStorage.getItem('rKtF') || '0');
  }

  getOrderDsbLocation() {
    return JSON.parse(localStorage.getItem('odsbdepID') || '0');
  }

  getRestOrderType() {
    return localStorage.getItem('ordtyp') || '';
  }

  getModuleID() {
    var moduleID = JSON.parse(sessionStorage.getItem('mid') || localStorage.getItem('mid') || '{}');
    if (sessionStorage.getItem('mid') == null) {
      sessionStorage.setItem('mid', moduleID);
    }
    return moduleID;

  }


  setMenuItem(item: any) {
    this.subject.next(item);
  }

  getMenuItem(): Observable<any> {
    return this.subject.asObservable();
  }





  getCardGst() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || "0");
    return credentials != 0 ? parseInt(atob(atob(credentials.value._reqCrG))) : 0;
  }

  getCashGst() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || "0");

    return credentials != 0 ? parseInt(atob(atob(credentials.value._reqCsG))) : 0;
  }


  getPosFee() {
    var val = 1;
    return val;
  }

  getServiceCharges() {
    var val = 2.5;
    return val;
  }



  //////////////////////// will provide logged in userID
  getUserID() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '{}');
    return parseInt(atob(atob(credentials.value._culId)));
  }

  getProjectID() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '0');
    return credentials != 0 ? parseInt(atob(atob(credentials.value._reqPrjID))) : 0;
  }

  getRoleTypeID() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '0');
    return credentials != 0 ? parseInt(atob(atob(credentials.value._reqRTID))) : 0;
  }

  ////////////////////// will provide the logged in user Name
  getUserName() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '{}');

    return atob(atob(credentials.value._culName)).toString();
    // return atob(atob(this.cookie.get('un'))).toString();

  }

  ////////////////////// will provide the logged in user Name
  getFastFoodCID() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '{}');
    return atob(atob(credentials.value._reqCID)).toString();
  }

  ////////////////////// will provide the logged in user Name
  getFastFoodSCID() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '{}');

    return atob(atob(credentials.value._reqSCID)).toString();
    //return credentials.value._reqSCID.toString();
    // return atob(atob(this.cookie.get('un'))).toString();

  }


  getRoleId() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '{}');

    return atob(atob(credentials.value._cuRId)).toString();

  }


  getComapnyLink() {
    var credentials = JSON.parse(localStorage.getItem('curVal') || '{}');

    return atob(atob(credentials.value._cuLnk)).toString();
    // return atob(atob(this.cookie.get('ul'))).toString()
  }


  /////////////////// will give the difference of hours of two Date and times 

  getHours(date1: any, Time1: any, date2: any, Time2: any) {
    const DateTime1 = new Date(Date.parse(date1 + ' ' + Time1));
    const DateTime2 = new Date(Date.parse(date2 + ' ' + Time2));

    // Check if the dates and times are valid.
    if (isNaN(DateTime1.getTime()) || isNaN(DateTime2.getTime())) {
      return false;
    }

    // Calculate the difference in seconds.
    const differenceInSeconds = (DateTime2.getTime() - DateTime1.getTime()) / 1000;

    // Calculate the difference in hours.
    const differenceInHours = differenceInSeconds / 3600;

    // Return the difference in hours.
    return differenceInHours;
  }

  curDate: any = new Date();
  public SubscriptionExpired(): boolean {

    var ExpiryDate: any = 'TWpBek1DMHhNQzB3T0E9PQ==';
    const now = new Date();

    const targetDate = new Date(atob(atob(ExpiryDate)));
    targetDate.setHours(10, 0, 0, 0);      // Create target date at 10:00 AM  // 10:00 AM exactly
    var status: any = now! >= targetDate;

    console.log(now, targetDate);
    return status;
  }

  /////////////////////////////////////////////////////////////////////////////////


  isSeparator = (value: string): boolean => value === '/' || value === '\\' || value === ':';
  getExtension = (path: string): string => {
    for (let i = path.length - 1; i > -1; --i) {
      const value = path[i];
      if (value === '.') {
        if (i > 1) {
          if (this.isSeparator(path[i - 1])) {
            return '';
          }
          return path.substring(i + 1);
        }
        return '';
      }
      if (this.isSeparator(value)) {
        return '';
      }
    }
    return '';
  };



  /////////////////////////////////////////////////////

  public getCompany(): Observable<any> {

    return this.http.get(environment.mainApi + 'cmp/getcompanyprofile').pipe(retry(3));
  }




  public getMenuList(): Observable<any> {
    return this.http.get(environment.mainApi + 'user/getusermenu?userid=' + this.getUserID() + '&moduleid=' + this.getModuleID()).pipe(retry(2));
  }


  public getCurrentOpenDay(): Observable<any> {
    return this.http.get(environment.mainApi + this.userLink + 'GetOpenedDay').pipe(retry(2));
  }




  openTill() {
    var frame1: any = $('<iframe />');
    frame1[0].name = 'frame1';
    frame1.css({ position: 'absolute', top: '-1000000px' });
    $('body').append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
        ? frame1[0].contentDocument.document
        : frame1[0].contentDocument;
    frameDoc.document.open();


    frameDoc.document.write('</head><body>');

    //Append the DIV contents.
    frameDoc.document.write('Till Open');
    frameDoc.document.write('</body></html>');

    frameDoc.document.close();

    window.frames[0].focus();
    window.frames[0].print();

    frame1.remove();



  }



  //////////////////////////print Funciton /////////////////////////////////


  printData(printSection: string) {

    if (this.TabletPrintFeature) {
      this.printSeperateWindow(printSection);
      return;
    }

    var contents = $(printSection).html();

    var frame1: any = $('<iframe />');
    frame1[0].name = 'frame1';
    frame1.css({ position: 'absolute', top: '-1000000px' });
    $('body').append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
        ? frame1[0].contentDocument.document
        : frame1[0].contentDocument;
    frameDoc.document.open();

    //<style type="text/css" media="print">/*@page { size: landscape; }*/</style>
    // <link rel="stylesheet" href="../../assets/style/bootstrap.min.css.map" type="text/css" />
    //<link rel="stylesheet" href="../css/bootstrap.css" type="text/css"  media="print"/>

    frameDoc.document.write(`
    <html>
      <head>
       
      <link rel="stylesheet" href="../../assets/style/ownStyle.css" type="text/css" media="print"/>
      <link rel="stylesheet" href="../../assets/style/bootstrap.min.css" type="text/css" media="print"/>
 
      </head>
      <body>
        ${contents}
       
      </body>
    </html>
  `);
    // frameDoc.document.write(

    //   '<link rel="stylesheet" href="../../assets/style/ownStyle.css" type="text/css" media="print"/>'
    //   + '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css" type="text/css" media="print"/>'
    //   //+'<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
    //   // '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css.map" type="text/css" />'+

    //   // '<link rel="stylesheet" href="../css/bootstrap.css" type="text/css"  media="print"/>'
    // );

    // frameDoc.document.write('</head><body>');

    // //Append the DIV contents.
    // frameDoc.document.write(contents);
    // frameDoc.document.write('</body></html>');

    frameDoc.document.close();

    setTimeout(function () {
      window.frames[0].focus();
      window.frames[0].print();

      frame1.remove();
    }, 500);



  }

  printSeperateWindow(printSection: string) {
    const contents = $(printSection).html();
    const win: any = window.open("", "_blank");

    win.document.write(`
    <html>
      <head>
        <link rel="stylesheet" href="../../assets/style/ownStyle.css" type="text/css" media="print"/>
        <link rel="stylesheet" href="../../assets/style/bootstrap.min.css" type="text/css" media="print"/>
      </head>
      <body>
        ${contents}
       
      </body>
    </html>
  `);

    win.onload = function () {
      win.print();
    };

    // win.onafterprint = function () {
    //    win.close();
    // };
    win.document.close();
  }

  printBill(printSection: string, focusClass: any) {
    var contents = $(printSection).html();

    var frame1: any = $('<iframe />');
    frame1[0].name = 'frame1';
    frame1.css({ position: 'absolute', top: '-1000000px' });
    $('body').append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
        ? frame1[0].contentDocument.document
        : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    // frameDoc.document.write(
    //   "<html><head><title>DIV Contents</title>" +
    //     "<style>" +
    //     printCss +
    //     "</style>"
    // );

    //Append the external CSS file. <link rel="stylesheet" href="../../../styles.scss" /> <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    // frameDoc.document.write(
    //   '<style type="text/css" media="print">@page { size: portrait; }</style>'
    // );
    frameDoc.document.write(

      '<link rel="stylesheet" href="../../assets/style/ownStyle.css" type="text/css" media="print"/>'
      + '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css" type="text/css" media="print"/>'

      //+'<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
      // '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css.map" type="text/css" />'+

      // '<link rel="stylesheet" href="../css/bootstrap.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write('</head><body>'
    );

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');

    frameDoc.document.close();

    setTimeout(function () {
      window.frames[0].focus();
      window.frames[0].print();

      frame1.remove();
      $(focusClass).trigger('focus');
    }, 500);

  }

  printFastFoodKOT(printSection: string) {
    var contents = $(printSection).html();

    var frame1: any = $('<iframe />');
    frame1[0].name = 'frame1';
    frame1.css({ position: 'absolute', top: '-1000000px' });
    $('body').append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
        ? frame1[0].contentDocument.document
        : frame1[0].contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(

      '<link rel="stylesheet" href="../../assets/style/ownStyle.css" type="text/css" media="print"/>'
      + '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css" type="text/css" media="print"/>'

    );
    frameDoc.document.write('</head><body>'
    );

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');

    frameDoc.document.close();

    setTimeout(function () {
      window.frames[0].focus();
      window.frames[0].print();

      frame1.remove();
    }, 2);


  }



  printBarcode(printSection: string) {
    var contents = $(printSection).html();

    var frame1: any = $('<iframe />');
    frame1[0].name = 'frame1';
    frame1.css({ position: 'absolute', top: '-1000000px' });
    $('body').append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
        ? frame1[0].contentDocument.document
        : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write(
      "<html><head><title>DIV Contents</title>"

    );

    //Append the external CSS file. <link rel="stylesheet" href="../../../styles.scss" /> <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    // frameDoc.document.write(
    //   '<style type="text/css" media="print">@page { size: portrait; }</style>'
    // );
    frameDoc.document.write(
      //  '<link rel="stylesheet" href="../../styles.scss" type="text/scss" media="print"/>'+
      '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css" type="text/css" media="print"/>' +
      '<link rel="stylesheet" href="../../assets/style/barcode.css" type="text/css" media="print"/>'



      //  +'<style type="text/css" media="print">.font-barcode{font-family:"barcode128" !important;}</style>'
      // +"<style>" +
      //     ".font-barcode{font-family:'barcode128' !important;}"
      //  +   "</style>"
      //+'<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
      // '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css.map" type="text/css" />'+

      // '<link rel="stylesheet" href="../css/bootstrap.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write('</head><body>');
    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');

    frameDoc.document.close();

    setTimeout(function () {
      window.frames[0].focus();
      window.frames[0].print();

      frame1.remove();
    }, 500);

  }


  //////////////////////////////////////////////////////////////////////


  printLandscape(printSection: string) {
    var contents = $(printSection).html();

    var frame1: any = $('<iframe />');
    frame1[0].name = 'frame1';
    frame1.css({ position: 'absolute', top: '-1000000px' });
    $('body').append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
        ? frame1[0].contentDocument.document
        : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    // frameDoc.document.write(
    //   "<html><head><title>DIV Contents</title>" +
    //     "<style>" +
    //     printCss +
    //     "</style>"
    // );

    //Append the external CSS file. <link rel="stylesheet" href="../../../styles.scss" /> <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    frameDoc.document.write(
      '<style type="text/css" media="print">@page { size: landscape; }</style>'
    );
    frameDoc.document.write(
      // '<style type="text/css" media="print">@page { size: landscape; }</style>'
      '<link rel="stylesheet" href="../../assets/style/ownStyle.css" type="text/css" media="print"/>'
      + '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css" type="text/css" media="print"/>'

      // '<link rel="stylesheet" href="../../assets/style/bootstrap.min.css.map" type="text/css" />'+

      // '<link rel="stylesheet" href="../css/bootstrap.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write('</head><body>');

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');

    frameDoc.document.close();

    setTimeout(function () {
      window.frames[0].focus();
      window.frames[0].print();

      frame1.remove();
    }, 500);
  }




  /////////////////////////////////////////////////////////////
  /////////////////////////////fotmate date in year-month-day formate///////
  /////////////////////////////////////////////////////////////////////

  dateFormater(date: any, separator: any) {

    return this.datePipe.transform(date, 'yyyy-MM-dd');
    // new Date(date);
    var day: any = date.getDate();
    // add +1 to month because getMonth() returns month from 0 to 11
    var month: any = date.getMonth() + 1;
    var year = date.getFullYear();

    // show date and month in two digits
    // if month is less than 10, add a 0 before it
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    // now we have day, month and year
    // use the separator to join them
    return year + separator + month + separator + day;
  }



  ///////////////////// to formate date to send to DB/////////////////////
  ////////// will solve the issue where  one day previous date sended/////////////////

  newDateFormate(date: Date) {
    const offset = date.getTimezoneOffset();
    if (offset < 0) {
      date.setHours(12, 0, 0);
    }
  }

  /////////////////////////////////// will validate the numonly field
  numberOnly() {
    $('.numOnly').on('keypress keyup blur', (event: any) => {
      event.target.value.replace(/[^\d].+/, "");
      if (event.which < 48 || event.which > 57) {
        event.preventDefault();

      }
    })
  }


  avoidMinus(val: any) {
    // alert(val.target.value);
    if (val.target.value < '0') {
      val.target.value = 0;
    } else if (val.target.value == '') {
      val.target.value = 0
    }
  }



  /****************************** */
  /*********** Text Masks ******* */
  /****************************** */
  cnicMask(): any {
    return [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
    ];
  }

  cnicOldMask(): any {
    return [
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];
  }

  mobileMask(): any {
    return [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];
  }

  phoneMask(): any {
    return [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  }

  ntnMask(): any {
    return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
  }

  bpsMask(): any {
    return [/\d/, /\d/];
  }



  //////////////////////////////////////////////////

  getProdImage(prodID: any) {
    return this.http.get(environment.mainApi + this.inventoryLink + 'GetProductImage?ProductID=' + prodID).pipe(retry(3));
  }


  ///////// show img in modal window
  showProductImage(img: any, prodID: number) {

    if (prodID != 0) {
      $('.loaderDark').show();
      this.http.get(environment.mainApi + this.inventoryLink + 'GetProductImage?ProductID=' + prodID).subscribe(
        (Response: any) => {
          this.dialog.open(ProductImgComponent, {
            width: '30%',
            data: Response[0].productImage
          }).afterClosed().subscribe();

          $('.loaderDark').fadeOut();
        }
      )
    } else {
      if ((img == undefined || img == '' || img == null || img == '-') && prodID == 0) {

      } else {
        this.dialog.open(ProductImgComponent, {
          width: '30%',
          data: img,
          disableClose: true,
        },).afterClosed().subscribe()
      }
    }


  }

  handleNumKeys(e: KeyboardEvent) {
    const allowedKeys = [
      'Enter', 'Backspace', 'Tab', 'Shift', 'Delete',
      'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
      '.', // Dot
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    // Allow numpad keys (Numpad0-Numpad9)
    const isNumpad = e.code.startsWith('Numpad') && /^[0-9]$/.test(e.key);

    if (!allowedKeys.includes(e.key) && !isNumpad) {
      e.preventDefault();
    }
  }

  handleNumKeysandMinut(e: KeyboardEvent) {
    const allowedKeys = [
      'Enter', 'Backspace', 'Tab', 'Shift', 'Delete',
      'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
      '.', // Dot
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'
    ];

    // Allow numpad keys (Numpad0-Numpad9)
    const isNumpad = e.code.startsWith('Numpad') && /^[0-9]$/.test(e.key);

    if (!allowedKeys.includes(e.key) && !isNumpad) {
      e.preventDefault();
    }
  }

  /////// will allow only number keys
  handleAlphabet(e: KeyboardEvent) {
    const key = e.key;

    const allowedKeys = [
      'Enter', 'Backspace', 'Tab', 'Shift', 'Delete',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];

    const isAlphabet = /^[a-zA-Z]$/.test(key);

    if (!isAlphabet && !allowedKeys.includes(key)) {
      e.preventDefault();
    }
  }
  prodFocusedRow = 0;
  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {


    /////move down
    if (e.keyCode == 40 || e.keyCode == 9) {


      if (prodList.length > 1) {
        this.prodFocusedRow += 1;
        if (this.prodFocusedRow >= prodList.length) {
          this.prodFocusedRow -= 1
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          $(clsName).trigger('focus');
          e.which = 9;
          $(clsName).trigger(e)
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        $(clsName).trigger('focus');


      }

    }

  }


  ///////////////// func to get products
  public getProducts(): Observable<any> {
    return this.http.get(environment.mainApi + this.inventoryLink + 'GetActiveProduct?reqCatFlag=0').pipe(retry(3));
  }

  public getFastFoodProducts(): Observable<any> {
    return this.http.get(environment.mainApi + this.inventoryLink + 'GetActiveProduct?reqCatFlag=1').pipe(retry(3));
  }

  //////////// func to get product Detail
  public getProdDetail(id: any, barcode: any, locationID = 0): Observable<any> {
    if (locationID == undefined) {
      locationID = 0;
    }
    var url = environment.mainApi + this.inventoryLink + `GetSingleProductDetail?ProductID=${id}&Barcode=${barcode}&LocID=${locationID}`
    console.log(url);
    return this.http.get(url).pipe(retry(3));
  }



  focusTo(cls: any) {
    setTimeout(() => {
      $(cls).trigger('focus')
    }, 500);
  }

  ///////////// for opening pincode modal window

  pin$ = of('1234');
  public openPinCode(): Observable<any> {
    return this.dialog.open(PincodeComponent, {
      width: 'auto',
      enterAnimationDuration: 500,
      // hasBackdrop: true,
      disableClose: true,
    }).afterClosed().pipe(retry(3));

    // if (this.PinCodeFeature) {
    //   return this.dialog.open(PincodeComponent, {
    //     width: '30%',
    //     enterAnimationDuration: 500,
    //     hasBackdrop: true,
    //     disableClose: true,
    //   }).afterClosed().pipe(retry(3));
    // } else {

    //   return from(
    //     Swal.fire({
    //       title: "Confirm To Proceed",
    //       showCancelButton: true,
    //       confirmButtonText: 'Confirm',
    //       showLoaderOnConfirm: true,
    //     })
    //   ).pipe(
    //     switchMap((result) => {
    //       if (result.isConfirmed) {
    //         return this.pin$.pipe(map(pin => '*' + pin)); // transform and return pin
    //       } else {
    //         return of(''); // return null if cancelled
    //       }
    //     })
    //   );

    // }
  }


  ///////////// for opening Password modal window
  public openPassword(type: any): Observable<any> {
    return this.dialog.open(PincodeComponent, {
      width: 'auto',
      enterAnimationDuration: 500,
      hasBackdrop: true,
      disableClose: true,
      data: type
    }).afterClosed().pipe(retry(3));
  }


  public confirmAlert(): Observable<any> {
    return this.dialog.open(ConfirmationAlertComponent, {
      width: 'auto',
      enterAnimationDuration: 300,
      hasBackdrop: true,
      // disableClose:true,
    }).afterClosed().pipe(retry(3));
  }


  public popupAlert(msg?: any) {
    return Swal.fire({
      title: "Alert",
      text: msg || 'Data Not Found!',
      timer: 1500,
    });
  }



  showPassword(event: any, id: any) {
    if ($(id).attr("type") == 'password') {
      return $(id).attr("type", "text");
    } else {

      return $(id).attr("type", "password");

    }
  }


  public getCustomerList(): Observable<any> {

    return this.http.get(environment.mainApi + this.companyLink + 'getcustomer').pipe(retry(3));
  }


  public getSupplierList(): Observable<any> {

    return this.http.get(environment.mainApi + this.companyLink + 'getsupplier').pipe(retry(3));
  }


  public getPartyList(): Observable<any> {

    return this.http.get(environment.mainApi + this.companyLink + 'getParty').pipe(retry(3));
  }

  public getBookerList(): Observable<any> {
    return this.http.get(environment.mainApi + this.inventoryLink + 'GetBooker').pipe(retry(3));
  }

  public getWarehouseLocationList(): Observable<any> {
    return this.http.get(environment.mainApi + this.inventoryLink + 'getlocation').pipe(retry(3));
  }

  public getIssueTypesList(): Observable<any> {
    return this.http.get(environment.mainApi + this.inventoryLink + 'GetIssueType').pipe(retry(3));
  }

  public getUserList(): Observable<any> {
    return this.http.get(environment.mainApi + this.userLink + 'getuser').pipe(retry(3));

  }

  public getBrandList(): Observable<any> {
    return this.http.get(environment.mainApi + this.inventoryLink + 'GetBrand').pipe(retry(3));
  }

  public getProjectList(): Observable<any> {
    return this.http.get(environment.mainApi + this.companyLink + 'getproject').pipe(retry(3));
  }


  public getCashBankCoa(type: any): Observable<any> {

    return this.http.get(environment.mainApi + 'acc/GetVoucherCBCOA?type=' + type).pipe(retry(3));
  }

  public getBankList(): Observable<any> {
    return this.http.get(environment.mainApi + 'acc/GetVoucherCBCOA?type=BRV').pipe(retry(3));
  }



  getUniqueRows<T>(arr: T[], keySelector: (item: T) => any): T[] {
    const seen = new Set();
    return arr.filter(item => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }


  public filterUniqueValues<T>(array: T[]): T[] {
    const uniqueSet = new Set<string>();
    const uniqueArray: T[] = [];

    array.forEach(item => {
      const key = JSON.stringify(item);
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        uniqueArray.push(item);
      }
    });

    return uniqueArray;
  }

  public filterUniqueValuesByKey<T>(array: T[], key: keyof T): T[] {
    const seen = new Set<any>();
    const result: T[] = [];

    for (const item of array) {
      const keyValue = item[key];
      if (!seen.has(keyValue)) {
        seen.add(keyValue);
        result.push(item);
      }
    }

    return result;
  }

  openBootstrapModal(modalID: any, condition: any, keyboard?: any) {
    if (condition) {
      const myModal = new bootstrap.Modal(modalID, { keyboard: keyboard || false, backdrop: keyboard || false });
      myModal.show();

    }
  }

  closeBootstrapModal(modalID: any, condition: any) {
    if (condition) {

      $(modalID).hide();
      // $('.modal').remove();
      // $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      // const myModal = new bootstrap.Modal(modalID);
      // alert();
      // myModal.hide()

    }
  }


  ExportDatatoExcel(data: any, fileName: any) {
    this.ExportExcel.exportDataToExcel(data, fileName);
  }

  ExportHTMLTabletoExcel(tableID: any, fileName: any) {
    this.ExportExcel.exportTableToExcel(tableID, fileName);
  }


  ////////////////// Make Table Scroll with the focus Change ////////////////

  scrollToRow(clsName: string, container: JQuery<HTMLElement>) {
    const rowElement = $(clsName);
    if (rowElement.length && container.length) {
      const rowTop = rowElement.offset()?.top || 0;
      const containerTop = container.offset()?.top || 0;
      const containerHeight = container.height()!;

      if (rowTop < containerTop) {
        container.scrollTop(container.scrollTop()! - (containerTop - rowTop));
      } else if (rowTop > containerTop + containerHeight) {
        container.scrollTop(container.scrollTop()! + (rowTop - (containerTop + containerHeight)));
      }

      rowElement.addClass('focused-row').siblings().removeClass('focused-row');
      rowElement.trigger('focus').trigger('select');
    }
  }




  sortByKey(array, key, order = 'asc') {
    return array.slice().sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }




  decodeSubscriptionCode(date: any) {

    var value = atob((atob(date)));
    //  value = value[0]+value[9]+value[1]+value[8]+'-'+value[2]+value[7]+'-'+value[3]+value[6]

    if (value[4] + value[5] == '01') {
      value = value[0] + value[9] + value[1] + value[8] + '-' + value[2] + value[7] + '-' + value[3] + value[6];

      // 0918 27 36
    } else if (value[4] + value[5] == '02') {
      value = value[1] + value[8] + value[2] + value[7] + '-' + value[0] + value[9] + '-' + value[3] + value[6];

      //1827 09 36

    } else if (value[4] + value[5] == '03') {
      value = value[1] + value[8] + value[2] + value[7] + '-' + value[3] + value[6] + '-' + value[0] + value[9];

      // 1827 36 09

    }
    else if (value[4] + value[5] == '04') {
      value = value[2] + value[7] + value[3] + value[6] + '-' + value[0] + value[1] + '-' + value[9] + value[8];

      // 2736 01 98

    }
    else if (value[4] + value[5] == '05') {
      value = value[2] + value[7] + value[3] + value[6] + '-' + value[1] + value[0] + '-' + value[8] + value[9];

      //2736 10 89  

    }
    else if (value[4] + value[5] == '06') {
      value = value[0] + value[2] + value[3] + value[6] + '-' + value[1] + value[9] + '-' + value[7] + value[8];

      // 0236 19 78

    }
    else if (value[4] + value[5] == '07') {
      value = value[6] + value[2] + value[8] + value[3] + '-' + value[1] + value[9] + '-' + value[7] + value[0];

      // 6283 19 70

    }
    else if (value[4] + value[5] == '08') {
      value = value[3] + value[9] + value[0] + value[7] + '-' + value[1] + value[6] + '-' + value[8] + value[2];

      // 3907 16 82

    }
    else if (value[4] + value[5] == '09') {
      value = value[9] + value[8] + value[7] + value[6] + '-' + value[3] + value[2] + '-' + value[1] + value[0];

      // 9876 32 10


    }

    else if (value[4] + value[5] == '10') {
      value = value[2] + value[7] + value[3] + value[6] + '-' + value[9] + value[8] + '-' + value[1] + value[0];

      // 2736 98 10


    }

    else if (value[4] + value[5] == '11') {
      value = value[3] + value[9] + value[6] + value[8] + '-' + value[1] + value[7] + '-' + value[2] + value[0];

      // 3968 17 20

    }

    else if (value[4] + value[5] == '12') {
      value = value[0] + value[7] + value[2] + value[8] + '-' + value[1] + value[9] + '-' + value[6] + value[3];

      // 3968 17 20

    }
    // console.log(value);
    return value;

  }



  encodeSubscriptionDate(date: Date, code: any) {
    var day: any = date.getDate().toString();
    var month: any = (date.getMonth() + 1).toString();
    var year: any = date.getFullYear().toString();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    //  var d =  year + '-' + month + '-' + day;
    var value = '';
    if (month == 1) {
      value = year[0] + year[2] + month[0] + day[0] + 0 + 1 + day[1] + month[1] + year[3] + year[1];


      // 0918 27 36
    } else if (month == 2) {
      value = month[0] + year[0] + year[2] + day[0] + 0 + 2 + day[1] + year[3] + year[1] + month[1];

      //1827 09 36

    } else if (month == 3) {
      value = day[0] + year[0] + year[2] + month[0] + 0 + 3 + month[1] + year[3] + year[1] + day[1];

      // 1827 36 09

    }
    else if (month == 4) {
      value = month[0] + month[1] + year[0] + year[2] + 0 + 4 + year[3] + year[1] + day[1] + day[0];

      // 2736 01 98

    }
    else if (month == 5) {
      value = month[1] + month[0] + year[0] + year[2] + 0 + 5 + year[3] + year[1] + day[0] + day[1];

      //2736 10 89  

    }
    else if (month == 6) {
      value = year[0] + month[0] + year[1] + year[2] + 0 + 6 + year[3] + day[0] + day[1] + month[1];

      // 0236 19 78

    }
    else if (month == 7) {
      value = day[1] + month[0] + year[1] + year[3] + 0 + 7 + year[0] + day[0] + year[2] + month[1];

      // 6283 19 70

    }
    else if (month == 8) {
      value = year[2] + month[0] + day[1] + year[0] + 0 + 8 + month[1] + year[3] + day[0] + year[1];

      // 3907 16 82

    }
    else if (month == 9) {
      value = day[1] + day[0] + month[1] + month[0] + 0 + 9 + year[3] + year[2] + year[1] + year[0];

      // 9876 32 10


    }

    else if (month == 10) {
      value = day[1] + day[0] + year[0] + year[2] + 10 + year[3] + year[1] + month[1] + month[0];

      // 2736 98 10


    }

    else if (month == 11) {
      value = day[1] + month[0] + day[0] + year[0] + 11 + year[2] + month[1] + year[3] + year[1];

      // 3968 17 20

    }

    else if (month == 12) {
      value = year[0] + month[0] + year[2] + day[1] + 12 + day[0] + year[1] + year[3] + month[1];

      // 0728 19 63

    }
    value = btoa(btoa(value + code));
    //  console.log(value);
    return value;
  }


  updateSubscription(data: any) {
    this.dialog.open(UpdateSubscriptionComponent, {
      width: "30%",
      data: data,
    }).afterClosed().subscribe(val => {


    })
  }


  generateSubscriptionKey(data: any) {
    this.dialog.open(SubscriptionKeyGeneratorComponent, {
      width: "30%",
      data: data,
    }).afterClosed().subscribe(val => {


    })
  }



  public postSaleInvoice(item: any) {
    return this.http.post(environment.mainApi + this.inventoryLink + 'PostInvoiceManual', {
      InvBillNo: item.invBillNo,
      partyID: item.partyID,
      ProjectID: this.getProjectID(),
      UserID: this.getUserID()
    }).pipe(retry(3));


    // .subscribe(
    //   (Response: any) => {
    //     if (Response.msg == 'Data Updated Successfully') {
    //       this.msg.SuccessNotify(Response.msg);
    //     } else {
    //       this.msg.WarnNotify(Response.msg);
    //     }
    //   }
    // )
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }



  downloadBase64Image(base64Data, fileName) {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  isBase64Image(str: string): boolean {
    if (typeof str !== "string") {
      return false;
    }

    // Regex for data:image/* base64 string
    const base64ImageRegex = /^data:image\/(png|jpg|jpeg|gif|webp|bmp|svg\+xml);base64,[A-Za-z0-9+/]+={0,2}$/;

    return base64ImageRegex.test(str);
  }



  ////////////////// will auto change start zero value on input click//////////////////
  handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 1 && input.value.startsWith('0')) {
      input.value = input.value.replace(/^0+/, '');
    }
    if (input.value === '') {
      input.value = '0';
    }
  }




}
