import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';


export interface LedgerEntry {
  label: string;
  amount: number;
}

export interface LedgerColumn {
  title: string;
  entries: LedgerEntry[];
}

export interface ReportMeta {
  storeName: string;
  date: string;
  day: string;
}

@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.scss']
})
export class AccountReportComponent implements OnInit {


  constructor(
    public global: GlobalDataModule,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {


  }


  // Accept real data later via bindings; fall back to dummy data for now
  @Input() reportMeta: ReportMeta = {
    storeName: 'BILAL TARIQ PHARMACY',
    date: '27-06-2026',
    day: 'Saturday'
  };

  fromDate: any = new Date();
  toDate: any = new Date();
  currentDay = this.global.getDayName(this.toDate);


  previousBalance = 0;
  cash = 0;
  bank = 0;


  @Input() quickStats: any = [];

  @Input() paymentColumn: LedgerColumn[] = [];

  @Input() expenseColumn: LedgerColumn[] = [];

  @Input() salesColumn: LedgerColumn[] = [];


  creditList: any = []



  getreport() {

    var fromDate = this.global.dateFormater(this.fromDate, '')
    var toDate = this.global.dateFormater(this.toDate, '')
    var url = `${environment.mainApi + this.global.accountLink}GetBtpClosingRpt?StartDate=${fromDate}&EndDate=${toDate}`;

    this.http.get(url).subscribe(
      (Response: any) => {
        console.log(Response);

        this.paymentColumn = Response.filter((e: any) => e.title == 'Medicine' || e.title == 'Cosmetics' || e.title == 'Sweets');
        this.expenseColumn = Response.filter((e: any) => e.title == 'Expense');
        this.salesColumn = Response.filter((e: any) => e.title == 'Sales');
        // this.creditList = Response.filter((e: any) => e.title == 'Credit')[0].entries;
        var previousDayBalance = Response.filter((e: any) => e.title == 'Opening Cash')[0].entries[0].amount;
        var cashBalance = Response.filter((e: any) => e.title == 'cash')[0].entries[0].amount;
        var bankBalance = Response.filter((e: any) => e.title == 'bank')[0].entries.reduce((sum, e) => sum + (+e.amount || 0), 0);


        var creditList = Response.filter((e: any) => e.title == 'Credit')[0].entries;
        var loanList = Response.filter((e: any) => e.title == 'Loan')[0].entries;

        this.quickStats = [
          { label: 'Previous Day Balance', type: 'pb', value: previousDayBalance },
          { label: 'Cash', type: 'cash', value: cashBalance },
          { label: 'Bank', type: 'bank', value: bankBalance },
        ];

        const creditStats = creditList.map((e: any) => ({
          label: e.label,
          value: e.amount,
          type: 'credit'
        }));

        const bankIndex = this.quickStats.findIndex(s => s.label === 'Bank');
        this.quickStats.splice(bankIndex + 1, 0, ...creditStats);


        ////////////////// Totaling bank,cash and credit and then pushing into list ////////////

        const sum = this.quickStats.reduce((acc, e) => {
          const matches = e.type == 'bank' || e.type == 'Cash' || e.type == 'credit';
          return acc + (matches ? (+e.value || 0) : 0);
        }, 0);

        this.quickStats.push({ label: 'Total', value: sum, type: 'total' });


        ////////////////// pushing loan in list

        const loanStats = loanList.map((e: any) => ({
          label: e.label,
          value: e.amount,
          type: 'loan'
        }));
        const loanIndex = this.quickStats.findIndex(s => s.label === 'Total');
        this.quickStats.splice(loanIndex + 1, 0, ...loanStats);



        ///////////////////// sum after loan and then push /////////

        
        const sumAfterLoan = this.quickStats.reduce((acc, e) => {
          const matches = e.type == 'loan' ;
          return acc + (matches ? (+e.value || 0) : 0);
        }, 0);

        this.quickStats.push({ label: 'Total CB', value: sum - sumAfterLoan , type: 'taf' });




        console.log(this.previousBalance)

      }
    )

  }
































  // Helper to build row-index arrays for *ngFor, since column lengths differ
  get ledgerRowIndexes(): number[] {
    const maxLen = Math.max(...this.paymentColumn.map(c => c.entries.length), 0);
    return Array.from({ length: maxLen }, (_, i) => i);
  }

  get breakdownRowIndexes(): number[] {
    const maxLen = Math.max(...this.salesColumn.map(c => c.entries.length), 0);
    return Array.from({ length: maxLen }, (_, i) => i);
  }

  columnTotal(entries: LedgerEntry[]): number {
    return entries.reduce((sum, e) => sum + e.amount, 0);
  }

  grandTotal(): number {
    const ledgerSum = this.paymentColumn.reduce(
      (sum, col) => sum + this.columnTotal(col.entries), 0
    );
    const breakdownSum = this.salesColumn.reduce(
      (sum, col) => sum + this.columnTotal(col.entries), 0
    );
    return ledgerSum + breakdownSum;
  }




  PrintTable() {
    this.global.printData('#printRpt');

  }

}
