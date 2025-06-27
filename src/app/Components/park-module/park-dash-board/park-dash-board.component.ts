import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Highcharts } from 'highcharts/highcharts-more.src';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-park-dash-board',
  templateUrl: './park-dash-board.component.html',
  styleUrls: ['./park-dash-board.component.scss']
})
export class ParkDashBoardComponent      {


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
    this.http.get(environment.mainApi+this.globalData.parkLink+'GetTotals').subscribe(
      (Response:any)=>{
        this.cardDataList = Response;
      }
    )
  }




  ///////////////////////////////////////////////////////////////////


  dayList:any =[];
  saleList:any = [];

  getMonthlySales(){
    this.http.get(environment.mainApi+this.globalData.parkLink+'GetDailyQtyTotal').subscribe(
      (Response:any)=>{
          Response.forEach((e:any) => {
          this.dayList.push(e.day);
          this.saleList.push(e.ticketQuantity)
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
        text: 'Analysis Sale (Current Month)',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories:this.dayList,
      },
      yAxis: {
        title: {
          text: 'Daily Ticket Sold Quantity ',
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
