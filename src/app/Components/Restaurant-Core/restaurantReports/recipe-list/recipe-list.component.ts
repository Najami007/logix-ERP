import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { RecipeDetailComponent } from '../../recipe/recipe-detail/recipe-detail.component';
import { RecipeComparisonComponent } from './recipe-comparison/recipe-comparison.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  companyProfile:any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private dialog: MatDialog,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {

      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });




  }
  ngOnInit(): void {
    this.global.setHeaderTitle('List of Recipe');
    this.getAllRecipe();
    this.getCategories();
  }

  startPerc:any = '';
  endPerc:any = '';
  RecipeList:any = [];
  categoriesList:any = [];
  catID = 0;
  tempRecipeList:any = [];
  
  filterRecipeByPercentage(){
    this.app.startLoaderDark();
  if(this.catID > 0){
    this.RecipeList = this.tempRecipeList.filter((e:any)=>((e.recipeCurrentCostPrice / e.recipeSalePrice) * 100) >= this.startPerc &&
    ((e.recipeCurrentCostPrice / e.recipeSalePrice) * 100) <= this.endPerc && e.recipeCatID == this.catID )
  }else{
    this.RecipeList = this.tempRecipeList.filter((e:any)=>((e.recipeCurrentCostPrice / e.recipeSalePrice) * 100) >= this.startPerc &&
    ((e.recipeCurrentCostPrice / e.recipeSalePrice) * 100) <= this.endPerc )
  }
     this.app.stopLoaderDark();
  }

  getCategories(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetRecipeCategories').subscribe(
      (Response:any)=>{
        this.categoriesList = Response;
     
      }
    )
  }


  getAllRecipe() {
    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetAllRecipes').subscribe(
      (Response: any) => {
           if (Response.length == 0 || Response == null) {
            this.global.popupAlert('Data Not Found!');
            this.app.stopLoaderDark();
            return;

          }
        this.tempRecipeList = Response;
     if(this.catID != 0){
      this.RecipeList = Response.filter((e:any)=>e.recipeCatID == this.catID);
     }else{
      this.RecipeList = Response;
     }
     this.app.stopLoaderDark();
      },
      (Error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  getRecipeImage(recipeID:any){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetRecipeImage?RecipeID='+recipeID).subscribe(
      (Response:any)=>{
    
          this.global.showProductImage(Response[0].recipeImage,0);

      }
    )
  }


  getDetail(item:any){
    this.dialog.open(RecipeDetailComponent,{
      width:'50%',
      data:[item,{type:'Dine In'}]
    }).afterClosed().subscribe()
  }

  getOtherRecipeDetail(item:any){
    this.dialog.open(RecipeDetailComponent,{
      width:'50%',
      data:[item,{type:'Other'}]
    }).afterClosed().subscribe()
  }

  print(){
    this.global.printData('#printRecipeList');
  }

  openComparison(){
    this.dialog.open(RecipeComparisonComponent,{
      width:'80%',
      disableClose:true,
    }).afterClosed().subscribe()
  }
}
