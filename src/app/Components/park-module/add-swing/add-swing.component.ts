import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-add-swing',
  templateUrl: './add-swing.component.html',
  styleUrls: ['./add-swing.component.scss']
})
export class AddSwingComponent {


  crudList: any = [];

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private app: AppComponent,
    private route: Router
  ) {

    // this.global.getMenuList().subscribe((data) => {
    //   this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    // })

  }


  btnType:any = 'Save';

  tabIndex: any;
  swingTitle:any;
  swingCode:any;
  ticketPrice:any;
  productImg:any;
  Description:any;






  onImgSelected(event:any) {

  
    var imgSize = event.target.files[0].size ;
    var isConvert:number = parseFloat((imgSize / 1048576).toFixed(2));

    if(isConvert > 2){
      
       this.msg.WarnNotify('File Size is more than 2MB');
    }
    else{

    ////////////// will check the file type ////////////////
      if(this.global.getExtension(event.target.value) != 'pdf'){   
        let targetEvent = event.target;

    /////////// assign the targeted file to file variable
        let file:File = targetEvent.files[0];   
    
        let fileReader:FileReader = new FileReader();
    
     //////////////// if the file is other than pdf eill assign to product img varialb
        fileReader.onload =(e)=>{
          this.productImg = fileReader.result;          
        }
    
        fileReader.readAsDataURL(file);
    
      }else{
    
          this.msg.WarnNotify('File Must Be in jpg or png formate');
          event.target.value = '';
          this.productImg = '';
        }

    }
 
    
  }



  save(){}

  reset(){}






  changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }

}
