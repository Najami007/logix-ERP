import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {

  mobileMask = this.globaldata.mobileMask;

  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router,
    private dataService:SharedServicesDataModule,
    
    ){
     

      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      });

      this.globaldata.getCompany().subscribe((data)=>{
        this.companyProfile = data;
      });

    }

    
    ngOnInit(): void {
      this.globaldata.setHeaderTitle('File');
     
    }

  tblSearch:any;
  fileID = 0;
  spType = '';
  userID = 0;
  fileName = '';
  fileDescription = '';
  fileCatagoryID = '';
  fileTypeID = 0;
  fileNatureID = 0;
  IsActive = '';


  plotCategoryList:any = [];
  plotTypeList:any = [];
  plotNatureList:any = [];
  tableData:any = [];




  edit(item:any){

  }
 delete(item:any){
    
  }
}
