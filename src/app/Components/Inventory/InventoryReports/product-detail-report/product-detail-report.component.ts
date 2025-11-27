import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-product-detail-report',
  templateUrl: './product-detail-report.component.html',
  styleUrls: ['./product-detail-report.component.scss']
})
export class ProductDetailReportComponent {



  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private datePipe: DatePipe

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

    this.getProduct();
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Product In Out History');
    this.getUsers();
    this.getProduct();

  }



  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  
  productList: any = [];
  productID = 0;


  getProduct() {
    this.global.getProducts().subscribe(
      (Response: any) => {
        if (Response.length > 0) {
          this.productList = Response.map((e: any, index: any) => {
            (e.indexNo = index + 1);
            return e;
          });

          this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
        }
      }
    )
  }



  onProdSelected() {
    var index = this.productList.findIndex((e: any) => e.productID == this.productID);
    this.productList[index].indexNo = this.productList[0].indexNo + 1;
    this.productList.sort((a: any, b: any) => b.indexNo - a.indexNo);
  }


   getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

dataList:any  = [];
  getReport(){

    if(this.productID == 0){
      this.msg.WarnNotify('Select Product');
      return;
    }

    var url = `${environment.mainApi+this.global.inventoryLink}GetSingleProductInfo_18?reqPid=${this.productID}`;

    this.http.get(url).subscribe(
      {
        next:(Response:any)=>{
          this.dataList = Response;

        },
        error:error=>{
          console.log(error);

        }
      }
    )

  }


  print() {
    this.global.printData('#PrintDiv')
  }


    export() {
    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    var tableID = '';
  
    this.global.ExportHTMLTabletoExcel('Detail', `(${startDate} - ${endDate}`)
  }




}
