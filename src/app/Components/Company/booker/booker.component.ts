import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booker',
  templateUrl: './booker.component.html',
  styleUrls: ['./booker.component.scss']
})
export class BookerComponent implements OnInit {

  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){
      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Booker');
    this.getBookerList();;
  }

    btnType= 'Save';
    bookerID:any;
  depSearch:any;
  bookerName:any;
  BookerDescription:any;


  bookerList:any = [];

  getBookerList(){
    this.http.get(environment.mainApi+this.globaldata.inventoryLink+'getBooker').subscribe(
      (Response)=>{
        this.bookerList = Response;
        //console.log(Response);
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured')
      }
    )
  }




  save(){
     if(this.bookerName == '' || this.bookerName == undefined){
      this.msg.WarnNotify('Enter Booker Name')
    }else {
      if(this.BookerDescription == '' || this.BookerDescription == undefined){
        this.BookerDescription = '-';
      }

      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.globaldata.openPinCode().subscribe(pin=>{
          if(pin!= ''){
            this.update(pin);
          }
        })
      }
    }

  }


  insert(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.globaldata.inventoryLink+'insertBooker',{
      BookerName: this.bookerName,
      BookerDescription:this.BookerDescription,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getBookerList();
          this.reset()
          this.app.stopLoaderDark();
        }else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  update(pin:any){
    // alert(this.sectionID);
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.globaldata.inventoryLink+'updateBooker',{
      BookerID:this.bookerID,
      BookerName: this.bookerName,
      BookerDescription:this.BookerDescription,
      PinCode:pin,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getBookerList();
          this.reset()
          this.app.stopLoaderDark();
        }else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  edit(row:any){
    
    this.bookerID = row.bookerID;
    this.bookerName = row.bookerName;
    this.BookerDescription = row.bookerDescription;
    this.btnType = 'Update';

  }


  delete(row:any){

    this.globaldata.openPinCode().subscribe(pin=>{
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

        this.app.startLoaderDark();
        
          this.http.post(environment.mainApi+this.globaldata.inventoryLink+'deletebooker',{
            BookerID: row.bookerID,
           PinCode:pin,
           UserID: this.globaldata.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Deleted Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getBookerList();
                this.app.stopLoaderDark();
              }else{
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            },
            (error:any)=>{
              this.app.stopLoaderDark();
            }
          )
          }})
        


      }
    })

  }

  reset(){
    this.bookerID = '';
    this.bookerName = '';
    this.btnType = 'Save';

  }

}
