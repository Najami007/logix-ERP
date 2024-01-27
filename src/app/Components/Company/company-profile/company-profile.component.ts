import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { error } from 'jquery';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {

  mobilemask = this.global.mobileMask;
  phonemask = this.global.phoneMask;
  crudList:any = [];

  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private app:AppComponent,
    private dialogue:MatDialog,
    private route:Router

  ){

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })


  }

    profileID:any;
    CompanyName:any = '';
    CompanyAlias:any = '';
    CompanyAddress:any;
    CompanyMobile:any;
    CompanyPhone:any;
    CompanyEmail:any;
    CompanyURL = '-';
    CompanyLogo1:any ;
    logo1Name:any
    Logo1Width:any;
    Logo1Height:any;
    CompanyLogo2:any;
    logo2Name:any;
    Logo2Width:any;
    Logo2Height:any;
    CompanyLogo3:any;
    Logo3Name:any;
    Logo3Width:any;
    Logo3Height:any;
    RegistrationDate:any;
    RegistrationNo:any;
    NTNNo: any;
    STRNNo: any;
    RegistrationDoc: any;
    regDocName:any;
    btnType = 'Save';

    logo1:any = '../../../../assets/Images/logo.png';
    logo2:any = '../../../../assets/Images/logo.png';
    logo3:any = '../../../../assets/Images/logo.png';



  ngOnInit(): void {
    this.global.setHeaderTitle('Company Profile');
    this.getCompany();
   
  }

  companyProfile:any = [];





  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.global.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }
  

////////////////////////////////////////////////////////////////////////


  onLogo1Selected(event:any) {

  if(this.global.getExtension(event.target.value) == 'png'){
    let targetEvent = event.target;

    let file:File = targetEvent.files[0];

    let fileReader:FileReader = new FileReader();


  
  fileReader.onload =(e)=>{
    this.CompanyLogo1 = fileReader.result;
  }

  fileReader.readAsDataURL(file);

  }else{
    
      event.target.value = '';
      this.CompanyLogo1 = '';
      this.msg.WarnNotify('File Must Be in png formate Only');
   
    }
  }

  onLogo2Selected(event:any) {

    if(this.global.getExtension(event.target.value) == 'png'){
    let targetEvent = event.target;

    let file:File = targetEvent.files[0];

    let fileReader:FileReader = new FileReader();


    fileReader.onload =(e)=>{
      this.CompanyLogo2 = fileReader.result;
    }

    fileReader.readAsDataURL(file);
  }else{

      this.msg.WarnNotify('File Must Be in png formate Only');
      event.target.value = '';
      this.CompanyLogo2 = '';
    }
  }

  onLogo3Selected(event:any) {

    if(this.global.getExtension(event.target.value) == 'png'){
    let targetEvent = event.target;

    let file:File = targetEvent.files[0];

    let fileReader:FileReader = new FileReader();


    fileReader.onload =(e)=>{
      this.CompanyLogo3 = fileReader.result;
    }

    fileReader.readAsDataURL(file);

  }else{

      this.msg.WarnNotify('File Must Be in png formate Only');
      event.target.value = '';
      this.CompanyLogo3 = '';
    }
  }

  onRegDocSelected(event:any) {

  
    if(this.global.getExtension(event.target.value) == 'pdf'){
      let targetEvent = event.target;

      let file:File = targetEvent.files[0];
  
      let fileReader:FileReader = new FileReader();
  
  
      fileReader.onload =(e)=>{
        this.RegistrationDoc = fileReader.result;
      }
  
      fileReader.readAsDataURL(file);

    }else {
    
        this.msg.WarnNotify('File Must Be pdf Only');
        event.target.value = '';
        this.RegistrationDoc = '';
      }
    


    //console.log(this.imageFile);
  }

////////////////////////////////////////////////////////////////////////
  getCompany(){
    this.http.get(environment.mainApi+this.global.companyLink+'getcompanyprofile').subscribe(
      (Response:any)=>{
       if(Response != ''){
        this.companyProfile = Response;
       }
       // console.log(Response);
        
         
          if(Response != '' && (Response[0].companyLogo1 != '' || Response[0].companyLogo1 != null || Response[0].companyLogo1 == '-')){
            this.logo1 = this.companyProfile[0].companyLogo1;
          }
      

        if(Response != '' && (Response[0].companyLogo2 != '' || Response[0].companyLogo2 != null || Response[0].companyLogo2 == '-')){
          this.logo2 = Response[0].companyLogo2;
        }

        if(Response != '' && (Response[0].companyLogo3 != '' || Response[0].companyLogo3 != null || Response[0].companyLogo3 == '-')){
          this.logo3 = Response[0].companyLogo3;
        }

        
        
      }
    )
  }

  
////////////////////////////////////////////////////////////////////////

  save(){
    if(this.CompanyName == '' || this.CompanyName == undefined){
      this.msg.WarnNotify('Enter Company Name')
    }else if(this.CompanyMobile == '' || this.CompanyMobile == undefined){
      this.msg.WarnNotify('Enter Company Mobile No')
    }else if(this.CompanyPhone == '' || this.CompanyPhone == undefined){
      this.msg.WarnNotify('Enter Phone No.')
    }else if(this.CompanyEmail == '' || this.CompanyEmail == undefined){
      this.msg.WarnNotify('Enter Company Email Address')
    }else if(this.CompanyAddress == '' || this.CompanyAddress == undefined){
      this.msg.WarnNotify('Enter Company Address')
    }else if(this.CompanyLogo1 == '' || this.CompanyLogo1 == undefined && this.btnType == 'Save'){
      this.msg.WarnNotify('Select LOGO 1')
    }else if(this.Logo1Height == '' || this.Logo1Height == undefined && this.btnType == 'Save'){
      this.msg.WarnNotify('Enter LOGO 1 Height')
    }else if(this.Logo1Width == '' || this.Logo1Width == undefined && this.btnType == 'Save'){
      this.msg.WarnNotify('Enter LOGO 1 Width')
    }else if(this.NTNNo == '' || this.NTNNo == undefined){
      this.msg.WarnNotify('Enter NTN NO')
    }else if(this.STRNNo == '' || this.STRNNo == undefined){
      this.msg.WarnNotify('Enter STRN No.')
    }else if(this.RegistrationDate == '' || this.RegistrationDate == undefined){
      this.msg.WarnNotify('Enter Registration Date')
    }else if(this.RegistrationNo == '' || this.RegistrationNo == undefined){
      this.msg.WarnNotify('Enter Registration No.')
    }else if(this.CompanyLogo3 !== '' && (this.CompanyLogo2 == '' )){
      this.msg.WarnNotify('Select Logo 2 First')
    }else if((this.CompanyLogo2 !== '') && (this.Logo2Height == '' || this.Logo2Height == 0 || this.Logo2Width == 0 || this.Logo2Width == '') ){
      //  alert(this.CompanyLogo2);
      this.msg.WarnNotify('Enter Logo 2 Height & Width');
    }else if( this.CompanyLogo3 !== '' && (this.Logo3Height == '' ||this.Logo3Height == 0 || this.Logo3Width == 0 || this.Logo3Width == '')){
        this.msg.WarnNotify('Enter Logo 3 Height  & Width'); 
    }
    else{

      if(this.CompanyLogo2 == '' || this.CompanyLogo2 == undefined){
        this.CompanyLogo2 = '';
      }
      if(this.CompanyLogo3 == '' || this.CompanyLogo3 == undefined){
        this.CompanyLogo3 = '';
      }


   

      if(this.btnType == 'Save'){
        this.insertCompany();
      }else if(this.btnType == 'Update'){
        this.dialogue.open(PincodeComponent,{
          width:"30%",
        }).afterClosed().subscribe(pin=>{         
            if(pin != ''){
              this.updateCompany(pin);  
            }
          
        })
      }
    }
  }

////////////////////////////////////////////////////////////////////////


  insertCompany(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.global.companyLink+'insertcp',{
      CompanyName:this.CompanyName,
      CompanyAlias:'Insert',
      CompanyAddress:this.CompanyAddress,
      CompanyMobile:this.CompanyMobile,
      CompanyPhone:this.CompanyPhone,
      CompanyEmail:this.CompanyEmail,
      CompanyURL:this.CompanyURL,
      CompanyLogo1:this.CompanyLogo1,
      Logo1Width:this.Logo1Width,
      Logo1Height:this.Logo1Height,
      CompanyLogo2:this.CompanyLogo2,
      Logo2Width:this.Logo2Width,
      Logo2Height:this.Logo2Height,
      CompanyLogo3:this.CompanyLogo3,
      Logo3Width:this.Logo3Width,
      Logo3Height:this.Logo3Height,
      RegistrationDate: this.global.dateFormater(this.RegistrationDate,'-'),
      RegistrationNo: this.RegistrationNo,
      NTN: this.NTNNo,
      STRN: this.STRNNo,
      RegistrationDoc: this.RegistrationDoc,
     
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getCompany();
          this.app.stopLoaderDark();
        }else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark()
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  ////////////////////////////////////////////////////////////////////////

  updateCompany(pin:any){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.global.companyLink+'updatecp',{
      PinCode:pin,
      CompanyProfileID: this.profileID,
      CompanyName:this.CompanyName,
      CompanyAlias:'Update',
      CompanyAddress:this.CompanyAddress,
      CompanyMobile:this.CompanyMobile,
      CompanyPhone:this.CompanyPhone,
      CompanyEmail:this.CompanyEmail,
      CompanyURL:this.CompanyURL,
      CompanyLogo1:this.CompanyLogo1,
      Logo1Width:this.Logo1Width,
      Logo1Height:this.Logo1Height,
      CompanyLogo2:this.CompanyLogo2,
      Logo2Width:this.Logo2Width,
      Logo2Height:this.Logo2Height,
      CompanyLogo3:this.CompanyLogo3,
      Logo3Width:this.Logo3Width,
      Logo3Height:this.Logo3Height,
      RegistrationDate: this.global.dateFormater(this.RegistrationDate,'-'),
      RegistrationNo: this.RegistrationNo,
      NTN: this.NTNNo,
      STRN: this.STRNNo,
      RegistrationDoc: this.RegistrationDoc,
      UserID: this.global.getUserID()
     
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getCompany();
          this.reset();
          this.app.stopLoaderDark();
        }else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error :any )=>{
        this.app.stopLoaderDark();
      }
    )
    this.app.stopLoaderDark();
  }

////////////////////////////////////////////////////////////////////////

  editProfile(row:any){
    console.log(row);
    this.btnType = 'Update';
    this.profileID = row.companyProfileID;
    this.CompanyName = row.companyName;
    this.CompanyMobile = row.companyMobile;
    this.CompanyPhone = row.companyPhone;
    this.CompanyEmail = row.companyEmail;
    this.CompanyAddress = row.companyAddress;
    this.CompanyLogo1 = row.companyLogo1;
    this.CompanyLogo2 = row.companyLogo2;
    this.CompanyLogo3 = row.companyLogo3;
    this.Logo1Height = row.logo1Height;
    this.Logo2Height = row.logo2Height;
    this.Logo3Height = row.logo3Height;
    this.Logo1Width = row.logo1Width;
    this.Logo2Width = row.logo2Width;
    this.Logo3Width = row.logo3Width;
    this.RegistrationDate = new Date(row.registrationDate);
    this.RegistrationNo = row.registrationNo;
    this.NTNNo = row.ntn;
    this.STRNNo = row.strn;
    this.RegistrationDoc = row.registrationDoc;
    
  }

////////////////////////////////////////////////////////////////////////

  downloadRegDoc(row:any){
    
    var newImage = row.replace('data:application/pdf;base64,','');
 
     const byteArray = new Uint8Array(atob(newImage).split('').map(char=> char.charCodeAt(0)));
 
     const file = new Blob([byteArray], {type:'application/pdf'});
 
     const fileURl = URL.createObjectURL(file);
 
     let fileName =  row.docTitle;
     let link = document.createElement('a');
     link.download = fileName;
     link.target = '_blank';
     link.href = fileURl;
     
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
 
 
 
   }



   ////////////////////////////////////////////////////////////////////////

  deleteProfile(item:any){

    this.dialogue.open(PincodeComponent,{
      width:"30%",
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

        //////on confirm button pressed the api will run
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.companyLink+'deletecp',{
          PinCode:pin,
          CompanyProfileID: item.companyProfileID,
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getCompany();
              window.location.reload();
              this.app.stopLoaderDark();
            }else{
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          },
          (error:any)=>{
            this.app.stopLoaderDark()
          }
        )
      }
    });
        

         


        }
      
    })

   

  }


  ////////////////////////////////////////////////////////////////////////

  reset(){
    this.btnType = 'Save';

    this.CompanyName = '';
    this.CompanyAlias = '';
    this.CompanyAddress = '';
    this.CompanyMobile = '';
    this.CompanyPhone = '';
    this.CompanyEmail = '';
    this.CompanyURL= '-';
    this.CompanyLogo1 = '';
    this.logo1Name =  '';
    this.Logo1Width = '';
    this.Logo1Height = '';
    this.CompanyLogo2 = '';
    this.logo2Name = '';
    this.Logo2Width = '';
    this.Logo2Height = '';
    this.CompanyLogo3 = '';
    this.Logo3Name = '';
    this.Logo3Width = '';
    this.Logo3Height = '';
    this.RegistrationDate = '';
    this.RegistrationNo = '';
    this.RegistrationDoc = '';
    this.NTNNo = '';
    this.STRNNo = '';
    
  }



}
