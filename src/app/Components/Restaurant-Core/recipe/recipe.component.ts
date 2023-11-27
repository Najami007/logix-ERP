import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit{


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

    this.menuProdList.push({
      productID : row.productID,
      productTitle:row.productTitle,
      quantity :1,
      costPrice:row.costPrice,
    
    })

  }


}
