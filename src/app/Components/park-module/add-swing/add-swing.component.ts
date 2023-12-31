import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-swing',
  templateUrl: './add-swing.component.html',
  styleUrls: ['./add-swing.component.scss']
})
export class AddSwingComponent implements OnInit {


  
  page:number = 1;
  count: number = 0;
 
  tableSize: number = 0;
  tableSizes : any = [];

  onTableDataChange(event:any){

    this.page = event;
    this.getSwing();
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1;
    this.getSwing();
  }



  crudList: any = [];

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private app: AppComponent,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Add Swing');
    this.getSwing();
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;

  }


  btnType:any = 'Save';

  tabIndex: any;
  swingID:any;
  swingTitle:any;
  swingCode:any;
  ticketPrice:any;
  productImg:any;
  Description:any;

  swingsList:any = [];


  getSwing(){
    this.http.get(environment.mainApi+'park/GetSwing').subscribe(
      (Response:any)=>{
        this.swingsList = Response;
      //  console.log(Response);

      }
    )
  }





  onImgSelected(event:any) {

  
    var imgSize = event.target.files[0].size ;
    var isConvert:number = parseFloat((imgSize / 1048576).toFixed(2));

    if(isConvert > 1){
      
       this.msg.WarnNotify('File Size is more than 1MB');
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

  


  save(){
    if(this.swingTitle == '' || this.swingTitle == undefined){
      this.msg.WarnNotify('Enter Swing Title')
    }else if(this.swingCode == '' || this.swingCode == undefined){
      this.msg.WarnNotify('Enter Swing Code')
    }else if(this.productImg == '' || this.productImg == undefined){
      this.msg.WarnNotify('Select Image')
    }else {
      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.update();
      }
    }
  }


  insert(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'park/InsertSwing',{
      SwingTitle:this.swingTitle,
      SwingCode: this.swingCode,
      TicketPrice:this.ticketPrice,
      SwingDescription: this.Description,
      SwingImage:this.productImg,
  
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSwing();
          this.reset();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.msg.WarnNotify(error);
      }
      
    )
  }

  update(){
    this.dialogue.open(PincodeComponent,{
      width:'30%',
    }).afterClosed().subscribe(pin=>{

    if(pin != ''){
      this.app.startLoaderDark();
      this.http.post(environment.mainApi+'park/UpdateSwing',{
        SwingID:this.swingID,
        SwingTitle:this.swingTitle,
        SwingCode: this.swingCode,
        TicketPrice:this.ticketPrice,
        SwingDescription: this.Description,
        SwingImage:this.productImg,
        PinCode:pin,
    
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getSwing();
            this.reset();
            this.app.stopLoaderDark();
          }else{
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
        },
        (error:any)=>{
          this.msg.WarnNotify(error);
        }
        
      )
        
    }
    })
    
  }

  reset(){
    this.swingID = 0;
    this.Description = '';
    this.ticketPrice = '';
    this.swingCode = '';
    this.swingTitle = '';
    this.productImg = '';
    this.btnType = 'Save';
  }


  delete(row:any){



    this.dialogue.open(PincodeComponent,{
      width:'30%',
    }).afterClosed().subscribe(pin=>{
      if(pin!= ''){
    Swal.fire({
      title:'Alert!',
      text:'Confirm to Delete the Data',
      position:'center',
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result)=>{
      if(result.isConfirmed){

        //////on confirm button pressed the api will run
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+'park/DeleteSwing',{
      
          SwingID: row.swingID,
          PinCode:pin,
          UserID: this.global.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Deleted Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getSwing();
                this.app.stopLoaderDark();

              }else{
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            }
          )
      }
    });

  }})

   
  }


  editswing(row:any){
    this.swingID = row.swingID;
    this.swingTitle = row.swingTitle;
    this.swingCode = row.swingCode;
    this.productImg = row.swingImage;
    this.ticketPrice = row.ticketPrice;
    this.Description = row.swingDescription;
    this.btnType = 'Update';


  }


  changeStatus(row:any){

        
    this.dialogue.open(PincodeComponent,{
      width:"30%",
    }).afterClosed().subscribe(pin=>{  
      
      if(pin !== ''){
        
        this.app.startLoaderDark();
      this.http.post(environment.mainApi+'park/ActiveSwing',{
        SwingID: row.swingID,
        ActiveStatus:!row.activeStatus,
        PinCode: pin,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getSwing();
            this.app.stopLoaderDark();
           
          }else{
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
        }
      )
      }
     
      
    })

  }




}
