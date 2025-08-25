import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-finished-item',
  templateUrl: './add-finished-item.component.html',
  styleUrls: ['./add-finished-item.component.scss']
})
export class AddFinishedItemComponent implements OnInit {


  apiReq = environment.mainApi + this.global.manufacturingLink;

  constructor(
    private http: HttpClient,

    public global: GlobalDataModule,
    private msg: NotificationService,
    private dialogRef: MatDialogRef<AddFinishedItemComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }
  ngOnInit(): void {

    this.getProducts();
    this.getCategoryList();

    if (this.editData) {
      this.getItemDetail(this.editData.mnuItemID)
      this.MnuItemID = this.editData.mnuItemID;
      this.MnuItemCatID = this.editData.mnuItemCatID;
      this.MnuItemTitle = this.editData.mnuItemTitle;
      this.MnuItemCode = this.editData.mnuItemCode;
      this.MnuItemSalePrice = this.editData.mnuItemSalePrice;
      this.MnuItemSize = this.editData.mnuItemSize;
      this.MnuItemDescription = this.editData.mnuItemDescription;
      this.btnType = 'Update';
    }

  }

  MnuItemID = 0;
  MnuItemTitle: any = '';
  MnuItemCode: any = '';
  MnuItemDescription: any = '';
  MnuItemSize: any = '';
  MnuItemCostPrice: any = '';
  MnuItemSalePrice: any = '';
  MnuItemCatID: any = '';
  ProjectID: any = '';



  getItemDetail(mnuItemID: any) {

    var url = `${this.apiReq}GetSingleIMnutemDetail?MnuItemID=${mnuItemID}`

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {

          if (Response.length > 0) {

            Response.forEach((e: any,index:any) => {
              if (e.groupID == 1) {
                this.tableDataList.push({
                  groupID: e.groupID ,
                  rowIndex:index,
                  productID: e.productID,
                  productTitle: e.productTitle,
                  quantity: e.quantity,
                  costPrice: e.avgCostPrice,
                })
              }
              if (e.groupID == 2) {
                this.tmpLabourChargesList.push({
                  groupID: e.groupID ,
                  productID: e.productID,
                  productTitle: e.productTitle,
                  quantity: e.quantity,
                  costPrice: e.costPrice,
                })
              }

               if (e.groupID == 3) {
                this.tmpOverHeadList.push({
                  groupID: e.groupID ,
                  productID: e.productID,
                  productTitle: e.productTitle,
                  quantity: e.quantity,
                  costPrice: e.costPrice,
                })
              }
            })

            this.getTotal();
          }

        }
      }
    )
  }



  /////////////////////// Functionality Related to adding Overhead Charges //////////

  tmpOverheadElementID: any = 1;
  tmpOverheadCostPrice: any = 0;
  tmpOverHeadPercentage: any = 0;

  tmpOverHeadList: any = [];
  overheadTotalAmount = 0;



  overheadElements = [
    { id: 1, value: 'Over Head and Profit' },
  ]






  addOverheadCharges() {

    if (this.labourTotalAmount + this.materialTotalAmount <= 0) {
      this.msg.WarnNotify('Enter Material and labour Charges First');
      return;
    }

    if (this.tmpOverHeadPercentage == 0 || this.tmpOverHeadPercentage == '0' || this.tmpOverHeadPercentage == undefined || this.tmpOverHeadPercentage == '') {
      this.msg.WarnNotify('Enter Overhead Percentage');
      return;
    }


    //////////// finding current element already entered or not
    var checkCondiditon: any = this.tmpOverHeadList.length > 0
      ? this.tmpOverHeadList.filter((e: any) => e.productTitle == this.tmpOverheadElementID)
      : [];

    if (this.tmpOverHeadList.length > 0 && checkCondiditon.length > 0) {
      this.msg.WarnNotify('Element Already Included');
      return;

    }


    var overHeadCost = ((this.labourTotalAmount + this.materialTotalAmount) * Number(this.tmpOverHeadPercentage)) / 100
    this.tmpOverHeadList.push({ groupID: 3, productID: 0, productTitle: this.tmpOverheadElementID, quantity: 1, costPrice: overHeadCost })

    this.getTotal();
  }




  delOverheadRow(item: any) {

    var index = this.tmpOverHeadList.indexOf(item);
    this.tmpOverHeadList.splice(index, 1);
    this.getTotal()



  }




  /////////////////////// Functionality Related to adding Labour Charges //////////


  tmplabourElementID: any = 0;
  tmpLabourQuantity: any = 0;
  tmpLabourCost: any = 0;

  labourTotalAmount = 0;

  labourElements = [
    { id: 1, value: 'Labour Cost 15/Cft Concrete with Boulders' },
    { id: 2, value: 'Curing Charges' },
  ]

  tmpLabourChargesList: any = [];

  addLabourCharges() {

    if (this.tmplabourElementID == 0) {
      this.msg.WarnNotify('Select Element');
      return;
    }

    if (this.tmpLabourQuantity == 0 || this.tmpLabourQuantity == '0' || this.tmpLabourQuantity == '' || this.tmpLabourQuantity == undefined) {
      this.msg.WarnNotify('Enter Quantity');
      return;
    }
    if (this.tmpLabourCost == 0 || this.tmpLabourCost == '0' || this.tmpLabourCost == '' || this.tmpLabourCost == undefined) {
      this.msg.WarnNotify('Enter Cost');
      return;
    }



    //////////// finding current element already entered or not
    var checkCondiditon: any = this.tmpLabourChargesList.length > 0
      ? this.tmpLabourChargesList.filter((e: any) => e.productTitle == this.tmplabourElementID)
      : [];

    if (this.tmpLabourChargesList.length > 0 && checkCondiditon.length > 0) {
      this.msg.WarnNotify('Element Already Included');
      return;

    }

    //////////// pushing element data
    this.tmpLabourChargesList.push({ groupID: 2, productID: 0, productTitle: this.tmplabourElementID, quantity: this.tmpLabourQuantity, costPrice: this.tmpLabourCost })

    this.getTotal();
    this.tmplabourElementID = 0;
    this.tmpLabourQuantity = 0;
    this.tmpLabourCost = 0;


  }


  delLabourRow(item: any) {

    var index = this.tmpLabourChargesList.indexOf(item);
    this.tmpLabourChargesList.splice(index, 1);
    this.getTotal()



  }



  /////////////////////// Functionality Related to adding Labour Charges End //////////




  /////////////////////// Functionality Related to adding Material Charges //////////

  btnType = 'Save';
  tableDataList: any = [];
  productList: any = [];
  materialTotalAmount = 0;

  PBarcode: any = '';
  getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
  }


  categoryList: any = [];
  getCategoryList() {
    this.http.get(environment.mainApi + this.global.manufacturingLink + 'GetMnuItemsCategories').subscribe(
      {
        next: (Response: any) => {
          this.categoryList = Response;
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }


   changeFocus(e: any, cls: any) {

    if (e.target.value == '') {
      if (e.keyCode == 40) {

        if (this.tableDataList.length >= 1) {
          this.rowFocused = 0;
          e.preventDefault();
          $('.qty0').trigger('select');
          $('.qty0').trigger('focus');

        }
      }
    }
    
    // else {
    //   this.prodFocusedRow = 0;
    //   /////move down
    //   if (e.keyCode == 40) {
    //     if (this.productList.length >= 1) {
    //       $('.prodRow0').trigger('focus');
    //     }
    //   }
    // }
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
        groupID: 1,
        rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
          : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
            : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
        productID: data.productID,
        productTitle: data.productTitle,
        barcode: tmpBarcode,
        quantity: tmpQuantity,
        costPrice: data.avgCostPrice,
        uomID: data.uomID,

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


  getTotal() {

    this.materialTotalAmount = 0;

    if (this.tableDataList.length > 0) {
      this.tableDataList.forEach((e: any) => {
        this.materialTotalAmount += e.quantity * e.costPrice;
      });
    }


    this.overheadTotalAmount = 0;
    if (this.tmpOverHeadList.length > 0) {
      this.tmpOverHeadList.forEach((e: any) => {
        this.overheadTotalAmount += e.costPrice * e.quantity;
      });
    }

    this.labourTotalAmount = 0;
    //////////// getting total of element
    if (this.tmpLabourChargesList.length > 0) {
      this.tmpLabourChargesList.forEach((e: any) => {
        this.labourTotalAmount += e.costPrice * e.quantity;
      });
    }

    this.MnuItemCostPrice = this.materialTotalAmount + this.overheadTotalAmount + this.labourTotalAmount;

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


  /////////////////////// Functionality Related to adding Material Charges End //////////








  save() {

    if (this.MnuItemTitle == '' || this.MnuItemTitle == undefined) {
      this.msg.WarnNotify('Enter Title');
      return;
    }

    if (this.MnuItemCatID == 0 || this.MnuItemCatID == undefined) {
      this.msg.WarnNotify('Select Category');
      return;
    }

    if (this.MnuItemCostPrice == 0 || this.MnuItemCostPrice == '0' || this.MnuItemCostPrice == undefined || this.MnuItemCostPrice == '') {
      this.msg.WarnNotify('Cost Not Valid');
      return;
    }

    if (this.MnuItemSalePrice == 0 || this.MnuItemSalePrice == '0' ||
      this.MnuItemSalePrice == undefined || this.MnuItemSalePrice == '' || (Number(this.MnuItemCostPrice) > Number(this.MnuItemSalePrice))) {
      this.msg.WarnNotify('Sale Price Not Valid');
      return;
    }

    if (this.MnuItemSize == '' || this.MnuItemSize == undefined) {
      this.msg.WarnNotify('Enter Size');
      return;
    }

    if(this.tmpLabourChargesList.length == 0){
      this.msg.WarnNotify('Enter Labour Elements');
      return;
    }

      if(this.tmpOverHeadList.length == 0){
      this.msg.WarnNotify('Enter Overhead Element');
      return;
    }

    var itemDetail = [...this.tableDataList, ...this.tmpLabourChargesList, ...this.tmpOverHeadList];


    var postData = {
      MnuItemID: this.MnuItemID,
      MnuItemTitle: this.MnuItemTitle,
      MnuItemCode: this.MnuItemCode || this.MnuItemTitle,
      MnuItemDescription: this.MnuItemDescription || '-',
      MnuItemSize: this.MnuItemSize,
      MnuItemCostPrice: this.MnuItemCostPrice,
      MnuItemSalePrice: this.MnuItemSalePrice,
      MnuItemCatID: this.MnuItemCatID,
      ProjectID: this.global.getProjectID(),
      ItemDetail: JSON.stringify(itemDetail),
      UserID: this.global.getUserID(),

    }

    if (this.btnType == 'Save') {
      this.insert('insert', postData)
    }

    if (this.btnType == 'Update') {

      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData['PinCode'] = pin;
          this.insert('update', postData)
        }
      })


    }



  }


  isProcessing = false;
  insert(type: any, postData: any) {

    var url = ''

    if (type == 'insert') {
      url = 'InsertMnuItem';
    }
    if (type == 'update') {
      url = 'UpdateMnuItem';
    }

    if (this.isProcessing) return;
    this.isProcessing = true;

    this.http.post(this.apiReq + url, postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.dialogRef.close('update');
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.isProcessing = false;
        },
        error: error => {
          console.log(error);
          this.isProcessing = false;
        }
      }
    )

  }


  reset() {

    this.MnuItemTitle = '';
    this.MnuItemCode = '';
    this.MnuItemDescription = '';
    this.MnuItemSize = '';
    this.MnuItemCostPrice = '';
    this.MnuItemSalePrice = '';
    this.MnuItemCatID = '';
    this.ProjectID = '';
    this.labourTotalAmount = 0;
    this.overheadTotalAmount = 0;
    this.materialTotalAmount = 0;
    this.tableDataList = [];
    this.tmpOverHeadList = [];
    this.tmpLabourChargesList = [];
    this.tmplabourElementID = 0;
    this.tmpLabourCost = 0;
    this.tmpLabourQuantity = 0;
    this.tmpOverheadCostPrice = 0;
    this.tmpOverheadElementID = 1;
    this.tmpOverHeadPercentage = 0;

  }



  closeDialog() {
    this.dialogRef.close();
  }

}
