import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-supplier-balance-report',
  templateUrl: './supplier-balance-report.component.html',
  styleUrls: ['./supplier-balance-report.component.scss']
})
export class SupplierBalanceReportComponent {

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private global: GlobalDataModule,
    private app: AppComponent,
    private route: Router,
    private msg: NotificationService
  ) {
    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Supplier Balances');
    this.getParty();
  }



  TableData: any = [];
  payableBalance = 0;
  ReceiveableBalance = 0;
  NetBalance = 0;

  getParty() {
    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSuppliersBalanceRpt').subscribe(
      (Response: any) => {
        this.TableData = [];
        this.payableBalance = 0;
        this.ReceiveableBalance = 0;
        this.NetBalance = 0;
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;

        }
        this.TableData = Response;
         this.TableData.forEach((e: any) => {
          if (e.balance > 0) {
            this.payableBalance += e.balance;
          }
          if (e.balance < 0) {
            this.ReceiveableBalance += e.balance;
          }
          this.NetBalance += e.balance
        });
        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();

      })
  }


  print() {
    this.global.printData('#PrintDiv');
  }




}
