import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';

@Component({
  selector: 'app-society-dashboard',
  templateUrl: './society-dashboard.component.html',
  styleUrls: ['./society-dashboard.component.scss']
})
export class SocietyDashboardComponent implements OnInit {


  constructor(private global: GlobalDataModule) {}

  payments_chart: Chart | undefined;
  plotCategories_pieChart: Chart | undefined;

  ngOnInit(): void {
    this.global.setHeaderTitle('Soceity Core Dashboard');
    this.paymentsChart();
    this.plotCategoryPieChart();
  }

  // highchart
  paymentsChart() {
    let chart = new Chart({
      // chart: {
      //   zoomType: 'xy',
      // },
      title: {
        text: 'Monthly Total Collections vs Cost of Land Collections',
      },
      subtitle: {
        text: 'Collection Graph',
      },
      xAxis: [
        {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          crosshair: true,
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: 'Rs. {value}',
            // style: {
            //   color: Highcharts.getOptions().colors[1],
            // },
          },
          title: {
            text: 'Collections',
            // style: {
            //   color: Highcharts.getOptions().colors[1],
            // },
          },
        },
        {
          // Secondary yAxis
          title: {
            text: 'Cost of Land',
            // style: {
            //   color: Highcharts.getOptions().colors[0],
            // },
          },
          labels: {
            format: 'Rs. {value}',
            // style: {
            //   color: Highcharts.getOptions().colors[0],
            // },
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        // backgroundColor:
        //   Highcharts.defaultOptions.legend.backgroundColor || // theme
        //   'rgba(255,255,255,0.25)',
      },
      series: [
        {
          name: 'Cost of Land',
          type: 'column',
          yAxis: 1,
          data: [
            49.9,
            71.5,
            106.4,
            129.2,
            144.0,
            176.0,
            135.6,
            148.5,
            216.4,
            194.1,
            95.6,
            54.4,
          ],
          tooltip: {
            valueSuffix: ' Rs.',
          },
        },
        {
          name: 'Collections',
          type: 'spline',
          data: [
            7.0,
            6.9,
            9.5,
            14.5,
            18.2,
            21.5,
            25.2,
            26.5,
            23.3,
            18.3,
            13.9,
            9.6,
          ],
          tooltip: {
            valueSuffix: ' Rs.',
          },
        },
      ],
    });
    this.payments_chart = chart;
  }

  plotCategoryPieChart() {
    let chart = new Chart({
      chart: {
        styledMode: false,
      },

      title: {
        text: 'Plot Categories',
      },

      xAxis: {
        categories: [
          '07 marla',
          '10 marla',
          '01 kanal',
          '02 kanal',
          'Commercial Areas',
          'Schools',
          'Mosques',
          'Parks',
          'Community Centers',
        ],
      },

      series: [
        {
          type: 'pie',
          allowPointSelect: true,
          keys: ['name', 'y', 'selected', 'sliced'],
          data: [
            ['07 marla', 29.9, false],
            ['10 marla', 71.5, false],
            ['01 kanal', 106.4, false],
            ['02 kanal', 129.2, false],
            ['Commercial', 144.0, false],
            ['Schools', 176.0, false],
            ['Mosques', 135.6, true, true],
            ['Coomunity Centers', 148.5, false],
          ],
          showInLegend: true,
        },
      ],
    });
    this.plotCategories_pieChart = chart;
  }
}
