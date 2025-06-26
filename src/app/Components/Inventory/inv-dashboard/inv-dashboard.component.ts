import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Highcharts } from 'highcharts/highcharts-more.src';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-inv-dashboard',
  templateUrl: './inv-dashboard.component.html',
  styleUrls: ['./inv-dashboard.component.scss']
})
export class InvDashboardComponent {


  constructor(private globalData: GlobalDataModule,
    private http: HttpClient,

  ) {

  }


  swingSale_pie_chart: Chart | undefined;
  monthly_Sale_Chart: Chart | undefined;
  monthly_Bar_Chart: Chart | undefined;


  ngOnInit(): void {

    this.globalData.setHeaderTitle('DashBoard');

    this.getsubCategorySale();
    this.GetSalePurchaseData();
    
    this.getCardsData();
    this.getMonthlySales();

    //this.getbudgetChart();


  }

MonthNameList: any = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  cardDataList: any = [{ totalSale: 0, totalPurchase: 0, totalItems: 0, totalAmount: 0, productTitle: '' }];


  getCardsData() {
    this.http.get(environment.mainApi + this.globalData.inventoryLink + 'GetTotals').subscribe(
      (Response: any) => {
        if (Response != '') {
          this.cardDataList = Response;
        }

      }
    )
  }




  ///////////////////////////////////////////////////////////////////


  dayList: any = [];
  saleList: any = [];

  getMonthlySales() {
    this.http.get(environment.mainApi + this.globalData.inventoryLink + 'GetSoldInvoicesQty').subscribe(
      (Response: any) => {
        Response.forEach((e: any) => {
          this.dayList.push(e.day);
          this.saleList.push(e.saleQty)
        });

        this.monthlySale();

      }
    )
  }


  monthlySale() {
    let chart = new Chart({
      chart: {
        type: 'line',
      },
      title: {
        text: 'ANALYSIS SALE INVOICES (CURRENT MONTH)',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: this.dayList,
      },
      yAxis: {
        title: {
          text: 'DAILY SOLD INVOICES QUANTITY ',
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: false,
        },
      },
      series: [
        {
          color:'',
          name: 'SALE INVOICES',
          type: 'line',
          data: this.saleList,
        },
      ],
    });
    this.monthly_Sale_Chart = chart;
  }

  ///////////////////////////////////////////////////////////

  salePurchaseMonthList: any = [];
  saleAmountList: any = [];
  purchaseAmountList: any = [];

  GetSalePurchaseData() {
    this.http.get(environment.mainApi + this.globalData.inventoryLink + 'GetSalePurchaseData').subscribe(
      (Response: any) => {
        console.log(Response);
        this.saleAmountList = [];
        this.purchaseAmountList = [];
        this.salePurchaseMonthList = [];
        if (Response.length > 0) {
          Response.forEach((e: any) => {
            if (e.invType == 'S') {
              this.saleAmountList.push(Math.round(e.amount));
            }
            if (e.invType == 'P') {
              this.purchaseAmountList.push(Math.round(e.amount))
            }

          });
           var monthList = this.globalData.filterUniqueValuesByKey(Response, 'month');
          monthList.forEach((e: any) => {
            this.salePurchaseMonthList.push(this.MonthNameList[e.month - 1]);
          })
        
        }


        this.barChart();
      }

       
    )
  }



  barChart() {
    let chart = new Chart({
      chart: {
        type: 'column',
      },
      title: {
        text: 'SALE VS PURCHASE',
      },
      subtitle: {
        text: 'LAST 12 MONTHS',
      },
      xAxis: {
        categories: this.salePurchaseMonthList,
        crosshair: true,
      },
      yAxis: {
        // min: 0,
        title: {
          text: 'AMOUNT',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} Rs</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          color:'#FFC107',
          name: 'SALE',
          type: 'column',



          data: this.saleAmountList,
        },
        {
          color:'#DC3545',
          name: 'PURCHASE',
          type: 'column',

          data: this.purchaseAmountList,
        },
      ],
    });
    this.monthly_Bar_Chart = chart;
  }


  ////////////////////////////////////////////////////////////


  subCategoryList: any = [];
  subCatSaleAmountList: any = [];

  getsubCategorySale() {
    this.http.get(environment.mainApi + this.globalData.inventoryLink + 'GetSubCatTotals').subscribe(
      (Response: any) => {
      if(Response.length > 0  ){
          Response.forEach((e: any) => {
          this.subCategoryList.push(e.catTitle);
          var tmpArry: any = [];
          tmpArry.push(e.catTitle, Math.round(e.amount), false, false);
          this.subCatSaleAmountList.push(tmpArry)
        });
      }

        this.subCatSaleChart();

      }
    )
  }


  subCatSaleChart() {
    let chart = new Chart({
      chart: {
        styledMode: false,
      },

      title: {
        text: 'SALE ANALYSIS (SUBCATEGORY)',
      },

      xAxis: {
        categories: this.subCategoryList,
      },
      tooltip: {
        headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style = "color:{series.color};padding:0"> </td>' +
          '<td style = "padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },

      series: [
        {
          type: 'pie',
          allowPointSelect: true,
          keys: ['name', 'y', 'selected', 'sliced'],
          data: this.subCatSaleAmountList,
          showInLegend: true,
        },
      ],
    });
    this.swingSale_pie_chart = chart;
  }




}

