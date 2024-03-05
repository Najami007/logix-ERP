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


  constructor(private globalData :GlobalDataModule,
    private http:HttpClient,

){

}

  swingSale_pie_chart: Chart | undefined;
  monthly_Sale_Chart: Chart | undefined;
  monthly_Bar_Chart: Chart | undefined;


  ngOnInit(): void {
 
    this.globalData.setHeaderTitle('Playtorium DashBoard');
  
    this.getSwingSale();
    this.barChart();
    this.getCardsData();
    this.getMonthlySales();
    this.getActiveTickets();
  
   //this.getbudgetChart();
   
  
  }

  cardDataList:any =[{totalSale:0,totalPurchase:0,totalItems:0,totalAmount:0,productTitle:''}];
 

  getCardsData(){
    this.http.get(environment.mainApi+this.globalData.inventoryLink+'GetTotals').subscribe(
      (Response:any)=>{
        if(Response != ''){
          this.cardDataList = Response;
        }
      
      }
    )
  }




  ///////////////////////////////////////////////////////////////////


  dayList:any =[];
  saleList:any = [];

  getMonthlySales(){
    this.http.get(environment.mainApi+this.globalData.inventoryLink+'GetSoldInvoicesQty').subscribe(
      (Response:any)=>{
        Response.forEach((e:any) => {
          this.dayList.push(e.day);
          this.saleList.push(e.saleQty )
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
        text: 'Analysis Sale Invoices (Current Month)',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories:this.dayList,
      },
      yAxis: {
        title: {
          text: 'Daily Sold Invoices Quantity ',
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
          name: 'Sale Invoices',
          type: 'line',
          data: this.saleList,
        },
      ],
    });
    this.monthly_Sale_Chart = chart;
  }

  ///////////////////////////////////////////////////////////

  barChart() {
    let chart =new Chart({
      chart: {
        type: 'column',
      },
      title: {
        text: 'SALES VS PURCHASE',
      },
      subtitle: {
        text: 'CURRENT MONTH',
      },
      xAxis: {
        categories: ['a','b','c','d'],
        crosshair: true,
      },
      yAxis: {
      min: 0,
      title: {
        text: 'Amount',
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
        name: 'Income',
        type: 'column',
        
        

        data: [4000,2000,3000,2000],
      },
      {
        name: 'Expense',
        type: 'column',
       
        data: [50000,2000,30000,20000],
      },
    ],
  });
    this.monthly_Bar_Chart = chart;
  }


  ////////////////////////////////////////////////////////////

  
  swingsList:any = [];
  swingSaleAmountList:any = [];

  getSwingSale(){
    this.http.get(environment.mainApi+this.globalData.parkLink+'GetSwingQtyTotal').subscribe(
      (Response:any)=>{


        Response.forEach((e:any) => {
          this.swingsList.push(e.swingTitle);
          var tmpArry:any = [];
            tmpArry.push(e.swingTitle, e.ticketQuantity, false,false);
          this.swingSaleAmountList.push(tmpArry)
        });
        
        this.swingSaleChart();
    
      }
    )
  }


  swingSaleChart() {
    let chart = new Chart({
      chart: {
        styledMode: false,
      },

      title: {
        text: 'Sale Analysis',
      },

      xAxis: {
        categories: this.swingsList,
      },
      tooltip: {
               headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style = "color:{series.color};padding:0">QTY: </td>' +
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
          data: this.swingSaleAmountList,
          showInLegend: true,
        },
      ],
    });
    this.swingSale_pie_chart = chart;
  }


  /////////////////////////////////////////////////////////////////

  activeMemberList:any = [];
  getActiveTickets(){
    this.http.get(environment.mainApi+this.globalData.parkLink+'GetActiveSwingQtyTotal').subscribe(
      (Response:any) =>{
        this.activeMemberList = Response;
    
      }
    )
  }


}

