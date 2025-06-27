import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Highcharts } from 'highcharts/highcharts-more.src';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-rest-dashboard',
  templateUrl: './rest-dashboard.component.html',
  styleUrls: ['./rest-dashboard.component.scss']
})
export class RestDashboardComponent  {


  constructor(private globalData :GlobalDataModule,
    private http:HttpClient,

){

}

  swingSale_pie_chart: Chart | undefined;
  monthly_Sale_Chart: Chart | undefined;


  ngOnInit(): void {
 
    this.globalData.setHeaderTitle('Playtorium DashBoard');
  
    this.getSwingSale();
 
    this.getCardsData();
    this.getMonthlySales();
    this.getActiveTickets();
  
   //this.getbudgetChart();
   
  
  }

  cardDataList:any =[];
 

  getCardsData(){
    this.http.get(environment.mainApi+this.globalData.restaurentLink+'GetTotals').subscribe(
      (Response:any)=>{
        console.log(Response,'Card Totals');
        this.cardDataList = Response;
         
      }
    )
  }




  ///////////////////////////////////////////////////////////////////


  dayList:any =[];
  saleList:any = [];

  getMonthlySales(){
    this.http.get(environment.mainApi+this.globalData.restaurentLink+'GetSoldInvoicesQty').subscribe(
      (Response:any)=>{
          Response.forEach((e:any) => {
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
        categories:this.dayList,
      },
      yAxis: {
        title: {
          text: 'DAILY BILL GENERATED QUANTITY',
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
          name: 'Montyly Sale',
          type: 'line',
          data: this.saleList,
        },
      ],
    });
    this.monthly_Sale_Chart = chart;
  }



  ////////////////////////////////////////////////////////////

  
  swingsList:any = [];
  swingSaleAmountList:any = [];

  getSwingSale(){
    this.http.get(environment.mainApi+this.globalData.restaurentLink+'GetCatTotals').subscribe(
      (Response:any)=>{
        
        console.log(Response);
        Response.forEach((e:any) => {
          this.swingsList.push(e.catTitle);
          var tmpArry:any = [];
            tmpArry.push(e.catTitle, e.amount, false,false);
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
        text: 'SALE ANALYSIS (CATEGORYWISE)',
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
