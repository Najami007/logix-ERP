import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { UpdateCoaComponent } from './update-coa/update-coa.component';
import Swal from 'sweetalert2';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})
export class COAComponent  implements OnInit {


  constructor(private msg:NotificationService,
    private app:AppComponent,
    private route:Router,
    private formBuilder: FormBuilder,
    private globalData: GlobalDataModule,
    private http:HttpClient,
    private dialogue:MatDialog
    ) { 

      this.globalData.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    

    }

  ngOnInit(): void {
    this.globalData.setHeaderTitle('Charts Of Accounts');
    this.getCoaType();
    this.GetChartOfAccount();
    this.globalData.numberOnly();
    this.getNotes();

  }




  numberOnly(val:any){
    this.globalData.avoidMinus(val);
  }

  crudList:any = [];
  error: any;
  coaSearch:any;
  actionbtn='Save';
  txtSearch :any;
  CoaType:any; 
  coaLevel:any;
  level1='';
  level2='';
  level3='';
  level4='';
  CoaTitle:any;
  TransactionAllowed:any;

  NoteID:any = 0;

  disableNote = true;
  
  


  coaTypesList:any;
  ChartsofAccountsData:any;
 
  coaLevel1List:any;
  coaLevel2List:any;
  coaLevel3List:any;
  coaLevel4List:any;

  LevelList:any;
  notesList:any;



  Allow = [
    {value:true, text: 'Yes' },
    
  ]

  
  
  //////////////setting the value of account head level above Head Name field/////////////////

  AccountLabelHeadValue:any = '';

  ///////////////////////////////

  setvalue(){
    
      if(this.coaLevel == 1){
        this.AccountLabelHeadValue = this.level1 ;
      }else if(this.coaLevel == 2){
         
         this.AccountLabelHeadValue =  this.level1 + '.' + this.level2 ;
      }else if(this.coaLevel == 3){
       
         this.AccountLabelHeadValue = this.level1 + '.'+this.level2+ '.' + this.level3 ;
      }else if(this.coaLevel == 4){
        // if(this.levelInput == null){
        //   this.AccountLabelHeadValue = '';
        //  }
         this.AccountLabelHeadValue = this.level1 + '.'+this.level2+ '.' +this.level3+ '.' + this.level4 ;
      }
  }

  

  /////////////////////////////

onCoaTypeChange(){
  this.LevelList =[
    {value:1,level: 'level 1' },
    {value:2, level: 'level 2' },
    {value:3, level: 'level 3' },
    {value:4, level: 'level 4' },

  ];
  this.getLevel1();
  
}

/////////////////////////////

onCoaLevelChange(){
  this.level1 = '';
  this.level2 = '';
  this.level3 = '';
  this.level4 = '';
  

  this.coaLevel2List = [];
  this.coaLevel3List = [];
  this.coaLevel4List = [];
}


/////////////////////////////
onlevel1Change(){
  this.getLevel2();
}

/////////////////////////////
onlevel2Change(){
  this.getLevel3();
}

/////////////////////////////
onlevel3Change(){
  this.getLevel4();
}
  


//////////////////////////////////////////////////

  noteEnable(){
    this.disableNote = true;
    this.NoteID = 0;
    
    if(this.CoaType == 1 && this.TransactionAllowed == true){
      this.disableNote = false;
    }else if(this.CoaType == 4 && this.TransactionAllowed == true){
      this.disableNote = false;
    }else if(this.CoaType == 5 && this.TransactionAllowed == true){
      this.disableNote = false;
    }else if(this.CoaType == 2 || this.CoaType == 3 ){
      this.NoteID = 0;
    }
  }



  //////////////////////////// will get the coa main five types///////////////////

  getCoaType(){
    this.http.get(environment.mainApi+'acc/getcoatype').subscribe(
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



  ///////////////////////////// will get the notes list
  
  getNotes(){
    this.http.get(environment.mainApi+'acc/GetNote').subscribe(
      (Response )=>{
        this.notesList = Response;

      }
      
    )
  }



  //////////////////////////////////////////////////////////
  GetChartOfAccount(){
    this.http.get(environment.mainApi+'acc/GetChartOfAccount').subscribe(
      {
        next:value=>{
    
          this.ChartsofAccountsData = value;
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }


  ///////////////////////////////////////

  getLevel1(){
    this.http.get(environment.mainApi+'acc/getlevel1?level0='+this.CoaType).subscribe(
      {
        next:value=>{
          // console.log(value);
          this.coaLevel1List = value;
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }

  /////////////////////////////////////////////////

  getLevel2(){
    this.http.get(environment.mainApi+'acc/getlevel2?level0='+this.CoaType+'&level1='+this.level1).subscribe(
      {
        next:value=>{
          // console.log(value);
          this.coaLevel2List = value;
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }


  ////////////////////////////////////
  getLevel3(){
    this.http.get(environment.mainApi+'acc/getlevel3?level0='+this.CoaType+'&level1='+this.level1+'&level2='+this.level2).subscribe(
      {
        next:value=>{
          // console.log(value);
          this.coaLevel3List = value;
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }


  //////////////////////////////
  getLevel4(){
    this.http.get(environment.mainApi+'acc/getlevel4?level0='+this.CoaType+'&level1='+this.level1+'&level2='+this.level2+'&level3='+this.level3).subscribe(
      {
        next:value=>{
          // console.log(value);
          this.coaLevel4List = value;
        },
        error:error=>{
          console.log(error);
        }
      }
    )
  }


  //////////////////////////save Button Functtion/////////////////////////////

  Save() {

    if(this.CoaType == '' || this.CoaType == undefined){
      this.msg.WarnNotify('Select the Charts Of Accouts Type')
    }else if(this.coaLevel == '' || this.coaLevel == undefined){
      this.msg.WarnNotify('Select COA Level')
    }
    // else if(this.coaLevel == 1){
    //   if(this.level1 == '' || this.level1 == undefined){
    //     this.msg.WarnNotify('Please Enter the Charts of Accounts Level')
    //   }
    // }else if(this.coaLevel == 2){
    //   if(this.level1 == '' || this.level1 == undefined){
    //     this.msg.WarnNotify('Select Level 1')
    //   }
    //    if(this.level2 == '' || this.level2 == undefined){
    //     this.msg.WarnNotify('Enter Level 2')
    //   }
    // }else if(this.coaLevel == 3){
    //   if(this.level1 == '' || this.level1 == undefined){
    //     this.msg.WarnNotify('Select Level 1')
    //   }
    //    if(this.level2 == '' || this.level2 == undefined){
    //     this.msg.WarnNotify('Select Level 2')
    //   }
    //    if(this.level3 == '' || this.level3 == undefined){
    //     this.msg.WarnNotify('Enter level 3')
    //   }
    // }else if(this.coaLevel == 4 ){
    //   if(this.level1 == '' || this.level1 == undefined){
    //     this.msg.WarnNotify('Select Level 1')
    //   }
    //    if(this.level2 == '' || this.level2 == undefined){
    //     this.msg.WarnNotify('Select Level 2')
    //   }
    //    if(this.level3 == '' || this.level3 == undefined){
    //     this.msg.WarnNotify('Select level 3')
    //   }
    //    if(this.level4 == '' || this.level4 == undefined){
    //     this.msg.WarnNotify('Enter level 4')
    //   }
    // }
    else if(this.CoaTitle == '' || this.CoaTitle == undefined){
      this.msg.WarnNotify('COA Title Required');
    }else if(((this.CoaType == 1 || this.CoaType == 4 || this.CoaType == 5) && this.TransactionAllowed == true) 
    && (this.NoteID == 0 || this.NoteID == undefined || this.NoteID == '' ) ){
      this.msg.WarnNotify('Select The Note');
    }
    else{
      this.app.startLoaderDark();
      this.http.post(environment.mainApi+'acc/InsertChartOfAccount',{
    CoaTitle: this.CoaTitle,
    CoaTypeID: this.CoaType,
    Level1: this.level1.toString(),
    Level2: this.level2.toString(),
    Level3:this.level3.toString(),
    Level4:this.level4.toString(),
    TransactionAllowed: this.TransactionAllowed,
    Editable: false,
    IsService: false,
    noteID:this.NoteID,
    UserID: this.globalData.getUserID(),
    
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
   
  }



  updateCoa(row:any){
    if(this.crudList.u == false){
      this.msg.WarnNotify('Not Allowed to Edit')
    }else{
      
      this.dialogue.open(UpdateCoaComponent,{
        width:"40%",
        data:row,
  
      }).afterClosed().subscribe(val=>{
        
        if(val == 'Update'){
          this.GetChartOfAccount();
        }
      })
    }
    
  }










///////////////////////////////////////////////////////////////////////////////
  deleteCoa(row:any){
 this.dialogue.open(PincodeComponent,{
  width:'30%',
 }).afterClosed().subscribe(pin=>{
  if(pin != ''){
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

        //////on confirm button mainApi the api will run
        this.http.post(environment.mainApi+'acc/DeleteChartOfAccount',{
          CoaID: row.coaID,
          PinCode:pin,
          AccountCode:row.accountCode,
          UserID: this.globalData.getUserID(),
            }).subscribe(
              (Response:any)=>{
                if(Response.msg == "Data Deleted Successfully"){
                  this.msg.SuccessNotify(Response.msg);
                  this.GetChartOfAccount();
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
              },
              (error:any)=>{
                this.error = error;
                // this.msg.WarnNotify(error);
                console.log(this.error);
              }
            )
      }
    });
  }
 })
    
  }
 //////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////will change the level Input field value if ///////////////////////////
  ////////////////////// value is in minue ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  changeValue(val:any){
    // alert(val.target.value);
    if(val.target.value < '0'){
      val.target.value = '';
    }
  }


  reset(){
    this.CoaType = '';
    this.coaLevel = '';
    this.level1 = '';
    this.level2 = '';
    this.level3 = '';
    this.level4 = '';
    this.AccountLabelHeadValue = '';
    this.CoaTitle = '';
    this.TransactionAllowed = "";
    this.NoteID = 0;

  }



 



}