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
    this.getBrandList();
    this.getLocation();
    this.getProductTypes();
  }


  reportTypeList:any = [
    {val:'full',title:'Full Report'},
    {val:'cw',title:'Categorywise'},
    {val:'scw',title:'Sub Categorywise'},
    {val:'bw',title:'Brandwise'},
    {val:'tw',title:'Typewise'},
    {val:'lw',title:'Locationwise'},
    {val:'cbw',title:'Category & Brandwise'},
    {val:'scbw',title:'Sub-Category & Brand wise'},
    {val:'ctw',title:'Category & Typewise'},
    {val:'sctw',title:'subCategory & Typewise'},
    {val:'cbtw',title:'Category, Brand & Typewise'},
    {val:'scbtw',title:'SubCategorywise, Brand & Typewise'},
    {val:'btw',title:'Brand & Typewise'},
    {val:'lcw',title:'Location & Categorywise'},
    {val:'lscw',title:'Location & Sub Categorywise'},
    {val:'lcbw',title:'Location, Category & Brandwise'},
    {val:'lscbw',title:'Location, Sub Category, Brandwise'},
    {val:'lctw',title:'Location, Category & Typewise'},
    {val:'lsctw',title:'Location, Sub Category & Typewise'},
    {val:'lctbw',title:'Location, Category, Type & Brandwise'},
    {val:'lsctbw',title:'Location, Sub-Category, Type & Brandwise'},

    
  ]


  catFlag = false;
  subCatFlag = false;
  locFlag = false;
  brandFlag = false;
  typeFlag = false;
  


  reportType = 'full';
  Title = '';

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


  categoryTitle = '';
  subCategoryTitle = '';
  brandTitle = '';
  typeTitle = '';
  locationTitle = '';

  chage(val:any){
    alert(val);
  }


  onSelection(type:any,event:any){
    

    if(type == 'cat'){
      this.categoryTitle =   this.CategoriesList.find((e:any)=>e.categoryID == this.categoryID).categoryTitle; 
    }

    if(type == 'subcat'){
      this.subCategoryTitle =   this.SubCategoriesList.find((e:any)=>e.subCategoryID == this.subCategoryID).subCategoryTitle;
    }

    if(type == 'brand'){
      this.brandTitle =  this.BrandList.find((e:any)=>e.brandID == this.brandID).brandTitle;
    }

    if(type == 'type'){
      this.typeTitle =    this.ProductTypeList.find((e:any)=>e.productTypeID == this.typeID).productTypeTitle;
    }

    if(type == 'location'){
      this.locationTitle =  this.locationList.find((e:any)=>e.locationID == this.locationID).locationTitle;
    }

  }

  getReport(){

    this.inventoryList = [];
    var idType ='';

    if(this.reportType == 'cw'){
      idType = '&cid='+this.categoryID;
      this.Title =   this.categoryTitle;  
    }

    if(this.reportType == 'scw'){
      idType = '&cid='+this.categoryID+'&scid='+this.subCategoryID;
      this.Title =  this.categoryTitle + ',' +  this.subCategoryTitle;
    }

    if(this.reportType == 'bw'){
      idType = '&bid='+this.brandID;
      this.Title =   this.brandTitle;
    }

    if(this.reportType == 'lw'){
      idType = '&lid='+this.locationID;
      this.Title =   this.locationTitle;
    }

    if(this.reportType == 'tw'){
      idType = '&tid='+this.typeID;
      this.Title =  this.typeTitle;
    }

    if(this.reportType == 'cbw'){
      idType = '&cid='+this.categoryID+'&bid='+this.brandID;
      this.Title =   this.categoryTitle + ' , ' + this.brandTitle;
    }

    if(this.reportType == 'scbw'){
      idType = '&cid='+this.categoryID+'&scid='+this.subCategoryID+'&bid='+this.brandID;
      this.Title =  this.categoryTitle+ ' , ' +this.subCategoryTitle+ ' , ' +this.brandTitle;
    }

    if(this.reportType == 'ctw'){
      idType = '&cid='+this.categoryID+'&tid='+this.typeID;
      this.Title =   this.categoryTitle+ ' , ' +this.typeTitle; 
       
    }

    if(this.reportType == 'sctw'){
      idType = '&cid='+this.categoryID+'&scid='+this.subCategoryID+'&tid='+this.typeID;
      this.Title =  this.categoryTitle+ ' , ' +this.subCategoryTitle+ ' , ' +this.typeTitle; 
       
    }

    if(this.reportType == 'cbtw'){
      idType = '&cid='+this.categoryID+'&bid='+this.brandID+'&tid='+this.typeID;
      this.Title =  this.categoryTitle+ ' , ' +this.brandTitle+ ' , ' +this.typeTitle;
    }

    if(this.reportType == 'scbtw'){
      idType = '&cid='+this.categoryID+'&scid='+this.subCategoryID+'&bid='+this.brandID+'&tid='+this.typeID;
      this.Title = this.categoryTitle+ ' , ' +this.subCategoryTitle+ ' , ' +this.brandTitle+ ' , ' +this.typeTitle;
    }


    if(this.reportType == 'btw'){
      idType = '&bid='+this.brandID+'&tid='+this.typeID;
      this.Title = this.brandTitle+ ' , ' +this.typeTitle;
    }

    if(this.reportType == 'lcw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle;
    }

    if(this.reportType == 'lscw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID+'&scid='+this.subCategoryID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle+ ' , ' +this.subCategoryTitle;
    }

    if(this.reportType == 'lcbw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID+'&bid='+this.brandID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle+ ' , ' +this.brandTitle;
    }

    if(this.reportType == 'lscbw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID+'&scid='+this.subCategoryID+'&bid='+this.brandID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle+ ' , ' +this.subCategoryTitle+' , '+this.brandTitle;
    }

    if(this.reportType == 'lctw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID+'&tid='+this.typeID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle+ ' , ' +this.typeTitle;
    }

    if(this.reportType == 'lsctw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID+ '&scid='+this.subCategoryID +'&tid='+this.typeID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle+ ' , '+this.subCategoryTitle + ' , ' +this.typeTitle;
    }

    if(this.reportType == 'lctbw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID+'&bid='+this.brandID+'&tid='+this.typeID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle+ ' , ' +this.brandTitle+' , '+this.typeTitle;
    }

    if(this.reportType == 'lsctbw'){
      idType = '&lid='+this.locationID+'&cid='+this.categoryID+'&scid='+this.subCategoryID +'&bid='+this.brandID+'&tid='+this.typeID;
      this.Title = this.locationTitle+ ' , ' +this.categoryTitle+ ' , '+this.subCategoryTitle + ' , ' +this.brandTitle+' , '+this.typeTitle;
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
      // alert(this.reportType+idType);
        this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventoryRpt?rptType='+this.reportType+idType).subscribe(
          (Response:any)=>{
          
            this.inventoryList = Response;
            // console.log(Response);
            this.app.stopLoaderDark();
            this.costTotal = 0;
            this.avgCostTotal = 0;
            this.saleTotal = 0;
            this.balanceQtyTotal = 0;

         if(Response != null)
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


  emptyField(){
    this.categoryID = 0;
    this.subCategoryID = 0;
    this.brandID = 0;
    this.locationID = 0;
    this.typeID = 0;
  }


  openDialog(){

    
    if(this.reportType == 'full'){
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = false
 
    }

    
    if(this.reportType == 'cw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = false
 
    }

    if(this.reportType == 'scw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = false
    }

    if(this.reportType == 'bw'){
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = false
    }

    if(this.reportType == 'lw'){
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = false
    }

    if(this.reportType == 'tw'){
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = true;
    }

    if(this.reportType == 'cbw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = false;
    }

    if(this.reportType == 'scbw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = false;
    }

    if(this.reportType == 'ctw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = true;
    }

    if(this.reportType == 'sctw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = false;
      this.typeFlag = true;
    }

    if(this.reportType == 'cbtw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = true;
    }

    if(this.reportType == 'scbtw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = true;
    }


    if(this.reportType == 'btw'){
      this.catFlag = false;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = false;
      this.typeFlag = true;
    }

    if(this.reportType == 'lcw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = false;
    }

    if(this.reportType == 'lscw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = false;
    }

    if(this.reportType == 'lcbw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = false;
    }

    if(this.reportType == 'lscbw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = false;
    }

    if(this.reportType == 'lctw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = true;
    }

    if(this.reportType == 'lsctw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = false;
      this.locFlag = true;
      this.typeFlag = true;
    }

    if(this.reportType == 'lctbw'){
      this.catFlag = true;
      this.subCatFlag = false;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = true;
    }

    if(this.reportType == 'lsctbw'){
      this.catFlag = true;
      this.subCatFlag = true;
      this.brandFlag = true;
      this.locFlag = true;
      this.typeFlag = true;
    }
    
  }


  print(){
    this.global.printData('#printRpt')
  }


  getSubCategory() {
    this.subCategoryID = 0;
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.categoryID);

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
