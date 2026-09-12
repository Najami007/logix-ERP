import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-desi-acc-entry',
  templateUrl: './desi-acc-entry.component.html',
  styleUrls: ['./desi-acc-entry.component.scss'],
  animations: [
    trigger('tabSlide', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(20px)' })
        ], { optional: true }),
        query(':leave', [
          style({ position: 'absolute', width: '100%' }),
          animate('180ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
        ], { optional: true }),
        query(':enter', [
          animate('220ms 60ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class DesiAccEntryComponent {

  tabs = [
    { id: 'payment', label: 'Payment' },
    { id: 'receipt', label: 'Receipt' },
     { id: 'sales', label: 'Sales' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' },
    { id: 'report', label: 'Report' },
  ];

  activeTab: string = 'payment';
  activeIndex: number = 0;

  selectTab(tabId: string, index: number): void {
    this.activeTab = tabId;
    this.activeIndex = index;
  }

}
