import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-issuance',
  templateUrl: './issuance.component.html',
  styleUrls: ['./issuance.component.scss']
})
export class IssuanceComponent {

  

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private dialog:MatDialog
  ){}



  ngOnInit(): void {
   this.global.setHeaderTitle('Recipe');
   this.getProductList();
  }


  recipeSearch:any ;

  totalCost:number = 0;


  productList:any = [];

  menuProdList:any = [];


  getProductList(){
    this.http.get(environment.mainApi+'inv/GetActiveProduct').subscribe(
      (Response)=>{
        this.productList = Response;
        //console.log(Response);
      }
    )
  }

  onProdSelect(row:any){

    if(this.menuProdList.find((e:any)=> e.productID == row.productID)){
    this.msg.WarnNotify('Item Already Exist')    
    }else{

      this.menuProdList.push({
        productID : row.productID,
        productTitle:row.productTitle,
        quantity :1,
        costPrice:row.costPrice,
      
      })
    }

    this.getTotal();


  }


  getTotal(){
    this.totalCost = 0;

    this.menuProdList.forEach((e:any) => {
      this.totalCost += e.costPrice * e.quantity;
    });
    
  }



  delRow(row:any){
    var index = this.menuProdList.indexOf(row);
    this.menuProdList.splice(index,1);
    this.getTotal();
  }

}
