import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { RecipeDetailComponent } from '../../recipe/recipe-detail/recipe-detail.component';

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


  RecipeList:any = [];
  categoriesList:any = [];
  catID = 0;
  

  getCategories(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetRecipeCategories').subscribe(
      (Response:any)=>{
        this.categoriesList = Response;
        //console.log(Response);
      }
    )
  }


  getAllRecipe() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetAllRecipes').subscribe(
      (Response: any) => {
     if(this.catID != 0){
      this.RecipeList = Response.filter((e:any)=>e.recipeCatID == this.catID);
     }else{
      this.RecipeList = Response;
     }

      }
    )
  }


  getDetail(item:any){
    this.dialog.open(RecipeDetailComponent,{
      width:'50%',
      data:item
    }).afterClosed().subscribe()
  }

  getOtherRecipeDetail(item:any){
    this.dialog.open(RecipeDetailComponent,{
      width:'50%',
      data:item
    }).afterClosed().subscribe()
  }

  print(){
    this.global.printData('#printRecipeList');
  }
}
