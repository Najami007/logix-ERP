import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-finished-item',
  templateUrl: './add-finished-item.component.html',
  styleUrls: ['./add-finished-item.component.scss']
})
export class AddFinishedItemComponent implements OnInit {

  constructor(
      private http: HttpClient,
  
      public global: GlobalDataModule,
      private msg: NotificationService,
      private dialogRef: MatDialogRef<AddFinishedItemComponent>,
      @Inject(MAT_DIALOG_DATA) public editData: any,
    ) { }
  ngOnInit(): void {

    this.getProducts();
  }

  btnType = 'Save';
    tableDataList:any = [];
  productList:any = [];

    PBarcode:any = '';
 getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
  }


    searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 0;
    var BType = '';

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {

        /// Seperating by / and coverting to Qty
        if (this.PBarcode.split("/")[1] != undefined) {
          barcode = this.PBarcode.split("/")[0];
          qty = parseFloat(this.PBarcode.split("/")[1]);
          BType = 'price';


        }
        /// Seperating by - and coverting to Qty 
        if (this.PBarcode.split("-")[1] != undefined) {
          barcode = this.PBarcode.split("-")[0];
          qty = parseFloat(this.PBarcode.split("-")[1]);
          BType = 'qty';

        }

        // this.app.startLoaderDark();
        this.global.getProdDetail(0, barcode).subscribe(
          (Response: any) => {
            if (Response == '' || Response == null || Response == undefined) {
              this.msg.WarnNotify('No Product Found')
              return;
            } else {

              if (BType == 'price') { qty = qty / parseFloat(Response[0].salePrice); }
              this.pushProdData(Response[0], qty);
            }
          }
        )


      

      }
    }
  }

  holdDataFunction(data: any) {
    this.global.getProdDetail(data.productID, '').subscribe(
      (Response: any) => {
        this.pushProdData(Response[0], 1)
      }
    )


  }

  pushProdData(data: any, qty: any) {
    /////// check already present in the table or not
    const targetBarcode = data.barcode2 || data.barcode;
    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID && x.barcode == targetBarcode

    );

    var index = this.tableDataList.indexOf(condition);
    //// push the data using index
    if (condition == undefined) {


      var tmpQuantity = 0;
      var discRupee = 0;
      var discPerc = 0;
      var tmpBarcode = '';

      if (data.barcode2) {
        tmpBarcode = data.barcode2;
      } else {
        tmpBarcode = data.barcode;
      }

      if (qty > 0) {
        tmpQuantity = qty * data.quantity;
      } else {
        tmpQuantity = data.quantity;
      }

    

      this.tableDataList.push({
        rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
          : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
            : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
        productID: data.productID,
        productTitle: data.productTitle,
        barcode: tmpBarcode,
        flavourTitle: data.flavourTitle,
        productImage: data.productImage,
        quantity: tmpQuantity,
        wohCP: data.costPrice,
        avgCostPrice: data.avgCostPrice,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        ovhPercent: 0,
        ovhAmount: 0,
        expiryDate: this.global.dateFormater(new Date(), '-'),
        batchNo: '-',
        batchStatus: '-',
        uomID: data.uomID,
        gst: 0,
        et: data.et,
        packing: data.packing,
        discInP: discPerc,
        discInR: discRupee,
        aq: data.aq,
        total: (data.salePrice * qty) - (discRupee * qty),
        productDetail: '',

      });
      this.sortTableData();
      this.getTotal();



    } else {
      if (this.PBarcode.split("/")[1] != undefined) {
        qty = this.PBarcode.split("/")[1] / this.tableDataList[index].salePrice;
      }
      var newQty: any = Number(qty) > 0 ? Number(qty) * data.quantity : data.quantity;
      this.tableDataList[index].quantity = Number(this.tableDataList[index].quantity) + newQty;

      /////// Sorting Table
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortTableData();
      this.getTotal();
    }


      this.PBarcode = '';
        this.getTotal();
        $('#searchProduct').trigger('focus');
  }

 sortType = 'desc';
  sortTableData() {
    this.sortType == 'desc'
      ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex)
      : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }


  rowFocused = -1;
    prodFocusedRow = 0;
    handleUpdown(item: any, e: KeyboardEvent, cls: string, index: number): void {
    const container = $(".table-logix");
    const key = e.keyCode;
    const isShiftTab = e.shiftKey && key === 9;

    // Tab key → Move focus to next row
    if (key === 9 && !e.shiftKey) {
      this.rowFocused = index + 1;
      return;
    }

    // Shift+Tab key → Move focus to previous row
    if (isShiftTab) {
      this.rowFocused = index - 1;
      return;
    }


    // Delete key → Remove the row
    if (key === 46) {
      this.delRow(item);
      this.rowFocused = 0;
      return;
    }

    // Arrow Down → Move to next row
    if (key === 40) {
      if (this.tableDataList.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.tableDataList.length - 1);
        const clsName = `${cls}${this.rowFocused}`;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select').trigger('focus');
      }
      return;
    }

    // Arrow Up → Move to previous row or focus search
    if (key === 38) {
      if (this.rowFocused > 0) {
        this.rowFocused--;
        const clsName = `${cls}${this.rowFocused}`;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select').trigger('focus');
      } else {
        e.preventDefault();
        $(".searchProduct").trigger('select').trigger('focus');
      }
      return;
    }

    // Allowable keys (numbers, arrows, delete, tab, enter, etc.)
    const allowedKeys = [
      8, 9, 13, 16, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110
    ];

    // Block any key not in allowedKeys
    if (!allowedKeys.includes(key)) {
      e.preventDefault();
    }
  }

    handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {


    /////// increment in prodfocus on tab click
    if (e.keyCode == 9 && !e.shiftKey) {
      this.prodFocusedRow += 1;

    }
    /////// decrement in prodfocus on shift tab click
    if (e.shiftKey && e.keyCode == 9) {
      this.prodFocusedRow -= 1;

    }
    /////move down
    if (e.keyCode == 40) {


      if (prodList.length > 1) {
        this.prodFocusedRow += 1;
        if (this.prodFocusedRow >= prodList.length) {
          this.prodFocusedRow -= 1
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          e.preventDefault();
          $(clsName).trigger('focus');
          //  e.which = 9;   
          //  $(clsName).trigger(e)       
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        e.preventDefault();
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        e.preventDefault();
        $(clsName).trigger('focus');


      }

    }

  }


  
  delRow(item: any) {
    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {

          var index = this.tableDataList.indexOf(item);
          this.tableDataList.splice(index, 1);
          this.getTotal();

          if (index == 0) {
            $('#psearchProduct').trigger('select');
            $('#psearchProduct').trigger('focus');
          } else {
            this.rowFocused = index - 1;
            $('.qty' + this.rowFocused).trigger('select');
            $('.qty' + this.rowFocused).trigger('focus');
          }
        }
      }
    )



  }




  getTotal(){

  }



  save(){

  }

  closeDialog(){
    this.dialogRef.close();
  }

}
