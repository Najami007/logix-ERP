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



  companyProfile: any = [];
  companyLogo: any = '';
  CompanyNTN = '';
  CompanySTRN = '';
  companyPNTN = '';
  companyFTN = '';
  companyBankTitle = '';
  companyBankCode = '';
  companyAccTitle = '';
  companyAccNumber = '';
  companyIBAN = '';
  companyRegistrationNo = '';
  footerText: any = '';

  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';


  constructor(
    public global: GlobalDataModule,
    private http: HttpClient,
  ) {



    this.global.getCompany().subscribe((data) => {
      this.CompanyNTN = data[0].ntn;
      this.CompanySTRN = data[0].strn;
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
      this.companyPNTN = data[0].pntn;
      this.companyFTN = data[0].ftn;
      this.companyBankTitle = data[0].bankName;
      this.companyBankCode = data[0].bankCode;
      this.companyAccTitle = data[0].accTitle;
      this.companyAccNumber = data[0].accNumber;
      this.companyIBAN = data[0].iban;
      this.companyRegistrationNo = data[0].registrationNo;
      this.footerText = data[0].footerText;
    });

  }

  ngOnInit(): void {
    this.global.setHeaderTitle('Report')


  }


  // Accept real data later via bindings; fall back to dummy data for now
  @Input() reportMeta: ReportMeta = {
    storeName: 'BILAL TARIQ PHARMACY',
    date: '27-06-2026',
    day: 'Saturday'
  };

  curDate = new Date();
  fromDate: any = new Date(); //new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1);
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

  getBackgroundColor(type: any) {


    var color = '';
    if (type == 'total' || type == 'taf'
      || type == 'nt' || type == 'taco') {
      color = '#FFFF00';
    }
    if (type == 'pb') {
      color = '#FF7F27';
    }

    return color;

  }



  getreport() {

    var fromDate = this.global.dateFormater(this.fromDate, '')
    var toDate = this.global.dateFormater(this.toDate, '')
    var url = `${environment.mainApi + this.global.accountLink}GetBtpClosingRpt?StartDate=${fromDate}&EndDate=${toDate}`;

    this.http.get(url).subscribe(
      (Response: any) => {
        this.quickStats = [];
        this.paymentColumn = [];
        this.expenseColumn = [];
        this.salesColumn = [];
        this.paymentColumn = Response.filter((e: any) => e.title == 'Medicine' || e.title == 'Cosmetics' || e.title == 'Sweets');
        this.expenseColumn = Response.filter((e: any) => e.title == 'Expense');
        this.salesColumn = Response.filter((e: any) => e.title == 'Sales');
        // this.creditList = Response.filter((e: any) => e.title == 'Credit')[0].entries;
        var previousDayBalance = Response.filter((e: any) => e.title == 'Opening Cash')[0].entries[0].amount;
        var cashBalance = Response.filter((e: any) => e.title == 'cash')[0].entries[0].amount;
        var bankBalance = Response.filter((e: any) => e.title == 'bank')[0].entries.reduce((sum, e) => sum + (+e.amount || 0), 0);
        var bankList = Response.filter((e: any) => e.title == 'bank')[0].entries;

        var creditList = Response.filter((e: any) => e.title == 'Credit')[0].entries;
        var loanList = Response.filter((e: any) => e.title == 'Loan')[0].entries;

        this.quickStats = [
          { label: 'PB', type: 'pb', value: previousDayBalance },
          { label: 'Cash', type: 'cash', value: cashBalance },
          // { label: 'Bank', type: 'bank', value: bankBalance },
        ];


        ///////////////////// pushing Banks and credit list into quick stats list ///////////////////////

        const bankStats = bankList.map((e: any) => ({
          label: e.label,
          value: e.amount,
          type: 'bank'
        }));


        const creditStats = creditList.map((e: any) => ({
          label: e.label,
          value: e.amount,
          type: 'credit'
        }));
        const bankValueIndex = this.quickStats.findIndex(s => s.type === 'cash');
        this.quickStats.splice(bankValueIndex + 1, 0, ...bankStats, ...creditStats);



        ////////////////// Totaling bank,cash and credit and then pushing into list ////////////

        const sum = this.quickStats.reduce((acc, e) => {
          const matches = e.type == 'bank' || e.type == 'cash' || e.type == 'credit';
          return acc + (matches ? (+e.value || 0) : 0);
        }, 0);

        this.quickStats.push({ label: 'Total', value: sum, type: 'total' });


        ////////////////// pushing loan in list /////////////////////////////

        const loanStats = loanList.map((e: any) => ({
          label: e.label,
          value: e.amount,
          type: 'loan'
        }));
        const loanIndex = this.quickStats.findIndex(s => s.label === 'Total');
        this.quickStats.splice(loanIndex + 1, 0, ...loanStats);



        ///////////////////// sum after loan and then push /////////


        const loanSumTotal = this.quickStats.reduce((acc, e) => {
          const matches = e.type == 'loan';
          return acc + (matches ? (+e.value || 0) : 0);
        }, 0);

        const sumAfterLoan = sum < 0 ? (sum) - (loanSumTotal * -1) : (sum) - (loanSumTotal)

        this.quickStats.push({ label: 'Total CB', value: sumAfterLoan, type: 'taf' });


        /////////////////// pushing expense and payments ///////////
        const expenseTotal = this.expenseColumn.reduce(
          (acc, col) => acc + col.entries.reduce((sum: number, e: any) => sum + e.amount, 0),
          0
        );

        const paymentTotal = this.paymentColumn.reduce(
          (acc, col) => acc + col.entries.reduce((sum: number, e: any) => sum + e.amount, 0),
          0
        );

        this.quickStats.push({ label: 'Total CO', value: expenseTotal + paymentTotal, type: 'tco' });

        const totalAfterCo = sumAfterLoan < 0 ? sumAfterLoan - ((expenseTotal + paymentTotal) * -1) : sumAfterLoan - (expenseTotal + paymentTotal);

        this.quickStats.push({ label: 'Total After CO', value: totalAfterCo, type: 'taco' });

        const previousBalanceLast = totalAfterCo < 0 && previousDayBalance < 0
          ? (previousDayBalance * -1)
          : totalAfterCo < 0 && previousDayBalance > 0
            ? (previousDayBalance * -1)
            : previousDayBalance;

        this.quickStats.push({ label: 'PB', type: 'pb', value: previousBalanceLast });

        const netTotal = totalAfterCo < 0 && previousDayBalance < 0 ? totalAfterCo + (previousDayBalance * -1) : totalAfterCo + previousDayBalance
        this.quickStats.push({ label: 'TS', type: 'nt', value: netTotal });


        const salesTotal = this.salesColumn.reduce(
          (acc, col) => acc + col.entries.reduce((sum: number, e: any) => sum + e.amount, 0),
          0
        );

        this.quickStats.push({ label: 'Sales', type: 'ts', value: salesTotal });

        var Difference = netTotal < 0 ? netTotal + salesTotal : netTotal - salesTotal;

        this.quickStats.push({ label: 'Dif', type: 'dif', value: Difference });


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
