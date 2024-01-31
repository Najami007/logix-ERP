import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-invreportcatwise',
  templateUrl: './invreportcatwise.component.html',
  styleUrls: ['./invreportcatwise.component.scss']
})
export class InvreportcatwiseComponent implements OnInit {








  

  page:number = 1;
  count: number = 0;
 
  tableSize: number = 25;
  tableSizes : any = [10,25,50,100];

  onTableDataChange(event:any){

    this.page = event;
    this.getReport();
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1;
    this.getReport();
  }



  companyProfile:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    public global:GlobalDataModule,
    private dialog:MatDialog,
    private route:Router
  ){
    
    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Inventory Report');
    this.getReport();
    this.getCategory();
    this.getSubCategory();
    this.getBrandList();
    this.getLocation();
    this.getProductTypes();
  }



  reportType = 'full';

  inventoryList:any = [];

  SubCategoriesList:any = []
  CategoriesList:any = [];
  BrandList:any = [];
  ProductTypeList:any =[];
  locationList:any = [];
  
  categoryID = 0;
  subCategoryID = 0;
  locationID = 0;
  typeID = 0;
  brandID = 0;

  

  costTotal = 0;
  avgCostTotal = 0;
  saleTotal = 0;
  balanceQtyTotal = 0;

  getReport(){


    var idType ='';

    if(this.reportType == 'cw'){
      idType = '&cid='+this.categoryID;
    }

    if(this.reportType == 'scw'){
      idType = '&cid='+this.categoryID+'&scid'+this.subCategoryID;
    }

    if(this.reportType == 'bw'){
      idType = '&bid='+this.brandID;
    }

    if(this.reportType == 'lw'){
      idType = '&lid='+this.locationID;
    }

    if(this.reportType == 'tw'){
      idType = '&tid='+this.typeID;
    }
    
 

    if(this.reportType == 'cw' && this.categoryID == 0){
      this.msg.WarnNotify('Select Category')
    }else if(this.reportType == 'scw' && (this.categoryID == 0 || this.subCategoryID == 0)){
      this.msg.WarnNotify('Select Category and Sub Category')
    }else if(this.reportType == 'bw' && this.brandID == 0 ){
      this.msg.WarnNotify('Select Brand')
    }else if(this.reportType == 'lw' && this.locationID == 0 ){
      this.msg.WarnNotify('Select Location')
    }else if(this.reportType == 'tw' && this.typeID == 0 ){
      this.msg.WarnNotify('Select Type')
    }else{
      this.app.startLoaderDark();
        this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventoryRpt?rptType='+this.reportType+idType).subscribe(
          (Response:any)=>{
            this.inventoryList = Response;
            // console.log(Response);
            this.app.stopLoaderDark();

            Response.forEach((e:any) => {
              this.costTotal += e.costPrice * (e.qtyIn - e.qtyOut);
              this.avgCostTotal += e.avgCostPrice * (e.qtyIn - e.qtyOut);
              this.saleTotal += e.salePrice * (e.qtyIn - e.qtyOut);
              this.balanceQtyTotal += e.qtyIn - e.qtyOut;
            });
            
          }
        )
       
    }


  }





  print(){
    this.global.printData('#printRpt')
  }





  getSubCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response;

      }
    )
  }




  getCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetCategory').subscribe(
      (Response: any) => {
        this.CategoriesList = Response;
      }
    )
  }

  
  getBrandList() {
    this.http.get(environment.mainApi +this.global.inventoryLink+'GetBrand').subscribe(
      (Response: any) => {
        this.BrandList = Response;
      }
    )
  }


  getProductTypes(){
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetProductType').subscribe(
      (Response: any) => {
        this.ProductTypeList = Response;
     
      }
    )
  }

  getLocation(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'getlocation').subscribe(
      (Response:any)=>{
        this.locationList = Response;
      }
    )
  }


}
