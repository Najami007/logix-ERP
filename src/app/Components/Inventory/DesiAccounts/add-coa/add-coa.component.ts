import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-coa',
  templateUrl: './add-coa.component.html',
  styleUrls: ['./add-coa.component.scss']
})
export class AddCoaComponent implements OnInit{

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
      });

    }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('ADD BANK');
     this.getCoaType();
    this.getSavedData('EXP');
   
    
   
  }

  txtSearch:any;
  coaTitle:any;
  coaID:number = 0;
  btnType:any = 'Save';
  description:any;



  notesList:any = [];
  coaList:any = [];
  coaTypesList:any = [];
  
  savedDataList:any = [];
  CoaTitle:any = '';
  CoaTypeID:any = 0;
  level1 = '';
  level2 = '';
  level3 = '';
  level4 = '';
  TransactionAllowed = true;
  NoteID:any =[];

  searchType:any = [{value:'EXP',title:'Expense'},{value:'INC',title:'Income'},]
///////////////////////////// will get the notes list
  
getNotes(){
  this.http.get(environment.mainApi+this.globaldata.accountLink+'GetNote').subscribe(
    (Response )=>{
      this.notesList = Response;

    }
    
  )
}


  //////////////////////////////////////////////////////////
  GetChartOfAccount(){
    this.http.get(environment.mainApi+this.globaldata.accountLink+'GetChartOfAccount').subscribe(
      {
        next:value=>{
    
          this.coaList = value;
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }


  
  //////////////////////////// will get the coa main five types///////////////////

  getCoaType(){
    this.http.get(environment.mainApi+this.globaldata.accountLink+'getcoatype').subscribe(
      {
        next:value=>{
          // console.log(value);
          this.coaTypesList = value;
         
          
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }



  getSavedData(type:any){
    this.globaldata.getCashBankCoa(type)
      .subscribe(
      (Response: any) => {
        // console.log(Response);
        this.savedDataList = Response;
      },
      (Error) => {
      
      }
    )
  }




  save(){
    if(this.coaTitle == '' || this.coaTitle == undefined){
      this.msg.WarnNotify('Enter Bank Title')
    }else{

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }

      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.update();

      }

    }

  }


  insert(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.globaldata.accountLink+'InsertChartOfAccount',{
    CoaTitle: this.CoaTitle,
    CoaTypeID: this.CoaTypeID,
    Level1: this.level1.toString(),
    Level2: '',
    Level3:'',
    Level4:'',
    TransactionAllowed: this.TransactionAllowed,
    Editable: false,
    IsService: false,
    noteID:this.NoteID,
    UserID: this.globaldata.getUserID(),
  
    }).subscribe(
      (Response:any)=>{
        // console.log(this.TransactionAllowed);
        if(Response.msg == "Data Saved Successfully"){
          this.msg.SuccessNotify(Response.msg);
          this.GetChartOfAccount();
          this.reset();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      }
      
    )
  }

  update(){

    this.globaldata.openPinCode().subscribe(pin=>{
      if(pin != ''){
        
    
        this.http.post(environment.mainApi+this.globaldata.accountLink+'UpdateChartofAccount',{
          CoaID: this.coaID,
          CoaTitle: this.coaTitle,
          NoteID:0,
          pinCode:pin,
          UserID: this.globaldata.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
          
    
            }else{
              this.msg.WarnNotify(Response.msg);
             
            }
          }
        )
      }
    })
  }



  reset(){
    this.coaTitle = '';
    this.coaID = 0 ;
    this.description = '';
    this.btnType = 'Save';

  }


  edit(row:any){
    this.coaID  = row.coaID;
    this.coaTitle = row.coaTitle;
    this.btnType  = 'Update';
  }

   
///////////////////////////////////////////////////////////////////////////////
delete(row:any){
  this.globaldata.openPinCode().subscribe(pin=>{
if(pin != ''){

      //////on confirm button mainApi the api will run
      this.http.post(environment.mainApi+this.globaldata.accountLink+'DeleteChartOfAccount',{
        CoaID: row.coaID,
        PinCode:pin,
        AccountCode:row.accountCode,
        UserID: this.globaldata.getUserID(),
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == "Data Deleted Successfully"){
                this.msg.SuccessNotify(Response.msg);
   
              }else{
                this.msg.WarnNotify(Response.msg);
              }
            },
            (error:any)=>{
              console.log(error);
            }
          )
  
}
})
  
}

}

