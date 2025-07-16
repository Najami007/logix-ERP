import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit{

  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
  ){}

  ngOnInit(): void {
         setTimeout(() => {
      $('#catTitle').trigger('focus')
    }, 500);
   
    
  }


  categoryTitle:any;
  description:any;
  categoryID:any;



  save(){
    if(this.categoryTitle == '' || this.categoryTitle == undefined){
      this.msg.WarnNotify('Enter Category Title')
    }else {

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }
      $('.loaderDark').show();
      this.http.post(environment.mainApi+this.global.inventoryLink+'insertcategory',{  
      CategoryTitle: this.categoryTitle,
      CategoryDescription: this.description,
      UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
        
            this.reset();
            this.dialogRef.close('Update')
            $('.loaderDark').fadeOut(500);
  
          }else{
            this.msg.WarnNotify(Response.msg);
            $('.loaderDark').fadeOut(500);
          }
        },
        (error:any)=>{
          $('.loaderDark').fadeOut(500);
  
        }
      )
   

    }
   
  }


  reset(){
    this.categoryTitle = '';
    this.description = '';

  }


  closeDialogue(){
    this.dialogRef.close();
  }


}
