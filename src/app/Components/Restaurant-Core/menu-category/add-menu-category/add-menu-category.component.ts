import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-menu-category',
  templateUrl: './add-menu-category.component.html',
  styleUrls: ['./add-menu-category.component.scss']
})
export class AddMenuCategoryComponent implements OnInit {
  crudList:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private dialog:MatDialog,
    private route:Router
    // @Inject (MAT_DIALOG_DATA) public data:any,
    // private dialogRef:MatDialogRef<AddMenuCategoryComponent>

  ){
    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }


  ngOnInit(): void {
    
  }

  btnType:any = 'Save';
  categoryTitle:any =  '';
  description:any = '';



  save(){

  }


  reset(){

  }




}
