import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-top-least-sale-qty-amountwise',
  templateUrl: './top-least-sale-qty-amountwise.component.html',
  styleUrls: ['./top-least-sale-qty-amountwise.component.scss']
})
export class TopLeastSaleQtyAmountwiseComponent {

  
  companyProfile: any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Top Least Sale Report');

  }

  reportsList:any = [
    {val:'Qty',title:'Quantitywise'},
    {val:'Amount',title:'Amountwise'},
]



  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  rptType:any = 'Qty';

  reportType:any = '';


  reportDataList :any = [];


  qtyTotal = 0;
  saleQtyTotal = 0;
  rtnQtyTotal = 0;
  netTotal = 0;

  getReport(type:any){

    this.app.startLoaderDark();
    this.http.get(environment.mainApi+this.global.inventoryLink+'RptTopLeastSaleQtyAndAmountWise_1?reqType='+type+'&FromDate='+
    this.global.dateFormater(this.fromDate, '-')+'&todate='+this.global.dateFormater(this.toDate, '-')+'&fromtime='+this.fromTime+'&totime='+this.toTime).subscribe(
      (Response:any)=>{
            if (Response.length == 0 || Response == null) {
              this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
              return;
              
            }
        this.reportDataList = Response;
       
        this.qtyTotal = 0;
        this.netTotal = 0;
        this.saleQtyTotal = 0;
        this.rtnQtyTotal = 0;
        Response.forEach((e:any) => {
          this.qtyTotal += e.quantity;
          this.netTotal += e.total;
          this.saleQtyTotal += e.saleQty;
          this.rtnQtyTotal += e.rtnQty;
        });

        this.app.stopLoaderDark();
      }
    )

  }





  print(){
    this.global.printData('#PrintDiv')
  }

}
