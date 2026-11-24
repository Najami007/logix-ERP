import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-dashboard-mining',
  templateUrl: './dashboard-mining.component.html',
  styleUrls: ['./dashboard-mining.component.scss'
  ]
})
export class DashboardMiningComponent implements OnInit {
  ngOnInit(): void {
    this.getData();
  }


  mining_dashboard_chart: Chart | undefined;
  mining_dashboard_chart2: Chart | undefined;

  amountList1: number[] = [];

  TitleList1: any = [];
  amountList2: number[] = [];

  TitleList2: any = [];


  readonly global = inject(GlobalDataModule);
  readonly http = inject(HttpClient);
  today: Date = new Date();

  toDate: Date = new Date();

  fromDate: Date = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  })();


  dataList1: any = [];
    dataList2: any = [];


  getData() {
    var fromDate = this.global.dateFormater(this.fromDate, '');
    var toDate = this.global.dateFormater(this.toDate, '');
    var url = `${environment.mainApi + this.global.miningLink}GetMineDashBoard?fromDate=${fromDate}&toDate=${toDate}`;
    console.log(url);
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          // this.dataList = Object.keys(Response[0]).map(key => ({
          //   Title: key.replace(/([A-Z])/g, ' $1')
          //     .replace(/^./, str => str.toUpperCase()),
          //   value: Response[0][key]
          // }));
          const keys = Object.keys(Response[0]);

          // First 7 records
          this.dataList1 = keys.slice(0, 7).map(key => ({
            Title: key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase()),
            value: Response[0][key]
          }));

          // Remaining records
          this.dataList2 = keys.slice(7).map(key => ({
            Title: key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase()),
            value: Response[0][key]
          }));

          // First 7 titles and values
          this.TitleList1 = keys.slice(0, 7).map(key =>
            key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
          );

          this.amountList1 = keys.slice(0, 7).map(key => Response[0][key]);


          // Remaining titles and values
          this.TitleList2 = keys.slice(7).map(key =>
            key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
          );

          this.amountList2 = keys.slice(7).map(key => Response[0][key]);
          this.MiningChart();
          this.MiningChart2();
        }
      }
    )
  }




  MiningChart() {
    let chart = new Chart({
      chart: {
        type: 'bar',
        height: 350,
      },

      title: {
        text: 'Cash Sales & Credit Ledger',
      },

      subtitle: {
        text: `${this.global.dateFormater(this.fromDate, '')} - ${this.global.dateFormater(this.toDate, '')}`,
      },

      xAxis: {
        categories: this.TitleList1,
        title: {
          text: null,
        },
      },

      yAxis: {
        min: 0,
        title: {
          text: 'AMOUNT (RS)',
        },
      },

      credits: {
        enabled: false,
      },

      tooltip: {
        pointFormat:
          '<b>{point.y:,.0f} Rs</b>',
      },

      plotOptions: {
        bar: {
          borderRadius: 5,
          pointPadding: 0.15,
          groupPadding: 0.15,

          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:,.0f}',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: this.amountList1,
        },
      ],
    });

    this.mining_dashboard_chart = chart;
  }

  MiningChart2() {
    let chart = new Chart({
      chart: {
        type: 'bar',
        height: 350,
      },

      title: {
        text: 'Diesel Details',
      },

      subtitle: {
        text: `${this.global.dateFormater(this.fromDate, '')} - ${this.global.dateFormater(this.toDate, '')}`,
      },

      xAxis: {
        categories: this.TitleList2,
        title: {
          text: null,
        },
      },

      yAxis: {
        min: 0,
        title: {
          text: 'AMOUNT (RS)',
        },
      },

      credits: {
        enabled: false,
      },

      tooltip: {
        pointFormat:
          '<b>{point.y:,.0f} Rs</b>',
      },

      plotOptions: {
        bar: {
          borderRadius: 5,
          pointPadding: 0.15,
          groupPadding: 0.15,

          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:,.0f}',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: this.amountList2,
        },
      ],
    });

    this.mining_dashboard_chart2 = chart;
  }



    printDashboard() {
    this.global.printData('#printRpt');

  }
}