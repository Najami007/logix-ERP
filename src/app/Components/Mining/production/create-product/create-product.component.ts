import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { error } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';




@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  ngOnInit(): void {
    this.global.setHeaderTitle('Create Product')
    this.getCategoriesList();
    this.getSaveProducts();
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }



  public http = inject(HttpClient);
  public global = inject(GlobalDataModule);
  public msg = inject(NotificationService);
  public app = inject(AppComponent);




  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.getSaveProducts();

  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSaveProducts();

  }



  onProdSearchKeyup(e: any, value: any) {

    if (e.target.value.length == 0 && this.tmpPage == 0) {
      this.tmpPage = this.page;
      this.page = 1;
    }
    if (e.key == 'Backspace') {
      if (value.length == 1) {
        this.page = this.tmpPage;
        this.tmpPage = 0;
      }
    }


  }



  get editMode(): boolean {
    return this.model.mnuItemID > 0;
  }

  // Replace with data loaded from your API
  categories: any = [];

  model: any = this.emptyProduct();
  productsList: any = [];
  searchText = '';
  editIndex = -1;
  selectedTab = 0;

  emptyProduct() {
    return {
      mnuItemID: 0,
      ProductTitle: '',
      CategoryID: null,
      Code: '',
      CostPrice: null,
      SalePrice: null,
      Description: '',
      LabourCharges: null
    };
  }

  validateModel(requiredFields: string[]): boolean {

    for (const field of requiredFields) {

      const value = this.model[field as keyof typeof this.model];

      if (value === null || value === undefined || String(value).trim() === '') {

        const fieldName = this.getFieldLabel(field);

        this.msg.WarnNotify(`Enter ${fieldName}`);
        return false;
      }
    }
    return true;
  }


  getFieldLabel(field: string): string {

    const labels: { [key: string]: string } = {
      ProductTitle: 'Product Title',
      CategoryID: 'Category',
      Code: 'Code',
      CostPrice: 'Cost Price',
      SalePrice: 'Sale Price',
      Description: 'Description',
      LabourCharges: 'Labour Charges',

    };

    return labels[field] || field;
  }



  getSaveProducts() {
    this.http.get(environment.mainApi + this.global.miningLink + 'GetMiningProductionItem').subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          this.productsList = Response;
        },
        error: (error) => {
          console.log(error);

        }
      }
    )

  }


  getCategoriesList() {
    this.http.get(environment.mainApi + this.global.manufacturingLink + 'GetMnuItemsCategories').subscribe(
      {
        next: (Response: any) => {
          this.categories = Response;
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }

  get filteredProducts() {
    const t = this.searchText.trim().toLowerCase();
    if (!t) return this.productsList;
    return this.productsList.filter(p =>
      p.ProductID.toLowerCase().includes(t) ||
      p.Code.toLowerCase().includes(t) ||
      p.Description.toLowerCase().includes(t) ||
      this.getCategoryName(p.CategoryID).toLowerCase().includes(t)
    );
  }

  getCategoryName(id: number | null): string {
    return this.categories.find(c => c.id === id)?.name ?? '';
  }

  save(): void {


    const requiredFields = [
      'ProductTitle',
      'CategoryID',
      'Code',
      'LabourCharges',
      'CostPrice',
      'SalePrice',
    ];

    if (!this.validateModel(requiredFields)) {
      return;
    }



    var postData = {
      MnuItemID: this.model.mnuItemID,
      MnuItemTitle: this.model.ProductTitle,
      MnuItemCode: this.model.Code,
      MnuItemDescription: this.model.Description || '-',
      MnuItemCostPrice: this.model.CostPrice,
      MnuItemSalePrice: this.model.SalePrice,
      MnuLabourCharges: this.model.LabourCharges,
      MnuItemCatID: this.model.CategoryID,
      ProjectID: this.global.getProjectID(),
      PinCode: '',
      UserID: this.global.getUserID()

    }


    if (this.model.mnuItemID > 0) {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData.PinCode = pin;
          this.insert('update', postData);
        }
      })
    } else {
      this.insert('insert', postData);
    }

  }


  insert(type: any, payload: any) {

    const insertType = {
      insert: 'InsertMiningProductionItem',
      update: 'UpdateMiningProductionItem',
      delete: 'DeleteMiningProductionItem',
      status: 'UpdateMiningProductionItemStatus'
    }[type];

   
    var url = `${environment.mainApi + this.global.miningLink + insertType}`;
       console.log(payload,url);
    this.app.startLoaderDark();
    this.http.post(url, payload).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully'
            || Response.msg == 'Data Updated Successfully'
            || Response.msg == 'Data Deleted Successfully'
            || Response.msg == 'Item Activated Successfully'
            || Response.msg == 'Item Deactivated Successfully'
          ) {
            this.msg.SuccessNotify(Response.msg);
            this.getSaveProducts();
            this.reset();

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        error: (error) => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )


  }


  edit(p: any): void {
    this.model = {
      mnuItemID: p.mnuItemID,
      ProductTitle: p.mnuItemTitle,
      CategoryID: p.mnuItemCatID,
      Code: p.mnuItemCode,
      CostPrice: p.mnuItemCostPrice,
      SalePrice: p.mnuItemSalePrice,
      Description: p.mnuItemDescription,
      LabourCharges: p.mnuLabourCharges
    }
  }

  delete(p: any): void {
    var payload = {
      MnuItemID: p.mnuItemID,
      PinCode: '',
      UserId: this.global.getUserID(),
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        payload.PinCode = pin;
        this.insert('delete', payload);
      }
    })
  }


  confirmApproval(item: any) {

    if (item.approvedStatus) return;

    var payLoad = {
      MnuItemID: item.mnuItemID,
      ActiveStatus: !item.activeStatus,
      PinCode: '',
      UserId: this.global.getUserID(),
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        payLoad.PinCode = pin;
        this.insert('status', payLoad);
      }
    })
  }


  reset(): void {
    this.model = this.emptyProduct();
  }
}

