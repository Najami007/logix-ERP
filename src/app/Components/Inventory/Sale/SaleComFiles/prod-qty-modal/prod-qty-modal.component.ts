import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';

@Component({
  selector: 'app-prod-qty-modal',
  templateUrl: './prod-qty-modal.component.html',
  styleUrls: ['./prod-qty-modal.component.scss']
})
export class ProdQtyModalComponent {



    constructor(
      public global: GlobalDataModule
  
    ) {}
  
  
    ngOnInit(): void {}



      @Input() qty = 0;
      @Output() updateQtyEmitter = new EventEmitter();
  

}
