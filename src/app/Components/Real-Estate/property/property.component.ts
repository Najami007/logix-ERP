import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AddPropertyComponent } from './add-property/add-property.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent {

  page:number = 1;
  count: number = 0;

  tableSize: number = this.global.paginationDefaultTalbeSize;
  tableSizes : any = this.global.paginationTableSizes;



  onTableDataChange(event:any){

    this.page = event;
    this.getSavedData();
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1 ;
    this.getSavedData();
  }

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private global:GlobalDataModule,
    
    
    ){}
  ngOnInit(): void {
    this.global.setHeaderTitle('Add Room');
    this.getSavedData();
  }

    searchtxt:any;

    PropertyList:any = [{}];


  add(){
    this.dialogue.open(AddPropertyComponent,{
      width:"90%",
      data:{data:'',type:'Save'}
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getSavedData();
      }
     
    })
  }

  gerPropertyDetail(item:any){
    this.dialogue.open(PropertyDetailComponent,{
      width:"90%",
      data:{data:item}
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getSavedData();
      }
     
    })
  }


  getSavedData(){
    this.http.get(environment.mainApi+this.global.propertyLink+'GetProperty').subscribe(
      (Response:any)=>{
        this.PropertyList = Response;
      }
    )

  }


  editRoom(row:any){
    this.dialogue.open(AddPropertyComponent,{
      width:"90%",
      data:{data:row,type:'Update'}
    }).afterClosed().subscribe(val=>{
      if(val == 'Update'){
        this.getSavedData();
      }
     
    })
  }


  deleteRoom(row:any){

    this.global.openPinCode().subscribe(pin =>{
     
      if(pin != ''){
        $('.loaderDark').show();
        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi+this.global.propertyLink+'DeleteProperty',{
          PropertyID:row.propertyID,
          PinCode: pin,
          userID:this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData();
              $('.loaderDark').fadeOut(500);
            }else{
              this.msg.WarnNotify(Response.msg);
              $('.loaderDark').fadeOut(500);
            }
          }
        )
      }

      }
    )
        
        
    

   

  }
}
