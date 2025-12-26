import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {

  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<AddPropertyComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
  ){

  }
  ngOnInit(): void {


   if(this.editData.type == 'Update'){

  this.PropertyID = this.editData.data.propertyID;
  this.PropertyTypeID = this.editData.data.propertyTypeID;
  this.PropertyStatusID = this.editData.data.propertyStatusID;
  this.CountryID = this.editData.data.countryID;
  this.CityID = this.editData.data.cityID;
  this.AreaID = this.editData.data.areaID;
  this.PropertyTitle = this.editData.data.propertyTitle;
  this.PropertyCode = this.editData.data.propertyCode;
  this.PropertySize = this.editData.data.propertySize;
  this.NoOfRooms = this.editData.data.noOfRooms;
  this.Adult = this.editData.data.adult;
  this.Children = this.editData.data.children;
  this.Bedroom = this.editData.data.bedroom;
  this.Bathroom = this.editData.data.bathroom;
  this.RentPerDay = this.editData.data.rentPerDay;
  this.PropertyAddress = this.editData.data.propertyAddress;
  this.PropertyDescription = this.editData.data.propertyDescription;
  this.BuildingDescription = this.editData.data.buildingDescription;
  this.AreaDescription = this.editData.data.areaDescription;
  this.SecurityDeposit = this.editData.data.securityDeposit;
  this.LocLatitude = this.editData.data.locLatitude;
  this.LocLongitude = this.editData.data.locLongitude;

    this.getPropertImages(this.editData.data.propertyID);
 setTimeout(() => {
  this.getPropertFeatures(this.editData.data.propertyID);
  this.getCity();
  this.getAreaList();
 }, 200);

    this.btnType = 'Update';
   }

   this.getPropertyTypes();
   this.getFeatureCategories();
   this.getFeaturesList();
   this.getPropertyStatus();
   this.getCountry();
 
  }

  autoEmpty = false;
  btnType = 'Save';
  PropertyID = 0;
  PropertyTypeID = 0;
  PropertyStatusID = 0;
  CountryID = 0;
  CityID = 0;
  AreaID = 0;
  PropertyTitle = '';
  PropertyCode = '';
  PropertySize = '';
  NoOfRooms = '';
  Adult = '';
  Children = '';
  Bedroom = '';
  Bathroom = '';
  RentPerDay = '';
  PropertyAddress = '';
  PropertyDescription = '';
  BuildingDescription = '';
  AreaDescription = "";
  SecurityDeposit = 0;
  LocLatitude:any = '';
  LocLongitude:any = '';


    


  categoryList:any;
  floorList:any;

  peopertyTypeList:any = [];

  peopertyStatusList:any = [];
  FeaturesList :any = [];

  featureCatList:any = [];

  countryList:any = [];
  citiesList:any = [];
  areaList:any = [];
  getAreaList(){
    this.http.get(environment.mainApi+this.global.companyLink+'GetArea').subscribe(
      (Response:any)=>{
        this.areaList = Response.filter((e:any)=> e.cityID == this.CityID);
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }

  getCity(){
    this.http.get(environment.mainApi+this.global.companyLink+'getcity').subscribe(
      (Response:any)=>{
        this.citiesList = Response.filter((e:any)=> e.countryID == this.CountryID);
      },
      
     
    )
  }
  getCountry(){
    this.http.get(environment.mainApi+this.global.companyLink+'getcountry').subscribe(
      (Response)=>{
        this.countryList = Response;
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }




  selectAllStatus = false;
  onCheckAll(item:any,value:any){
   if(value == 'all'){
    this.FeaturesList.forEach((e:any) => {
      if(this.selectAllStatus == false){
       e.status = false;
      }else{
       e.status = true;
      }
     });
   }

   if(value == 'cat'){
    this.FeaturesList.forEach((e:any) => {
      if(this.selectAllStatus == false){
       e.status = false;
      }else{
       e.status = true;
      }
     });
   }
  }

  getPropertyTypes(){
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyType').subscribe(
      (Response) => {
        this.peopertyTypeList = Response;
      },
      (Error) => {
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }

  getPropertyStatus(){
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyStatus').subscribe(
      (Response) => {
        this.peopertyStatusList = Response;
        //console.log(Response);
      },
      (Error) => {
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }

  getFeatureCategories(){
  this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyCategory').subscribe(
    (Response) => {
      this.featureCatList = Response;
    },
    (Error) => {
      this.msg.WarnNotify('Error Occured while Loading Countries List')
    }
  )
  }


  getFeaturesList(){
  this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyFeature').subscribe(
    (Response:any) => {
      this.FeaturesList = [];
      if(Response != ''){
        Response.forEach((e:any) => {
          this.FeaturesList.push({propertyFeatureID:e.propertyFeatureID,propertyFeatureTitle:e.propertyFeatureTitle,
            propertyCategoryID:e.propertyCategoryID,status:false})
        });
      }
      //console.log(Response);
    },
    (Error) => {
      this.msg.WarnNotify('Error Occured while Loading Countries List')
    }
  )
  }



  Save(){
    
  
      
      if(this.btnType == 'Save'){
        this.insert();
      }

      if(this.btnType == 'Update'){
        this.update();
      }

    
  }

  insert(){
    $('.loaderDark').show();
    this.http.post(environment.mainApi+this.global.propertyLink+'InsertProperty',{
    PropertyTypeID: this.PropertyTypeID,
    PropertyStatusID: this.PropertyStatusID,
    CountryID: this.CountryID,
    CityID: this.CityID,
    AreaID: this.AreaID,
    PropertyTitle: this.PropertyTitle,
    PropertyCode: this.PropertyCode,
    PropertySize: this.PropertySize,
    NoOfRooms: this.NoOfRooms,
    Adult: this.Adult,
    Children: this.Children,
    Bedroom: this.Bedroom,
    Bathroom: this.Bathroom,
    RentPerDay: this.RentPerDay,
    PropertyAddress: this.PropertyAddress,
    PropertyDescription: this.PropertyDescription,
    BuildingDescription: this.BuildingDescription,
    AreaDescription: this.AreaDescription,
    SecurityDeposit: this.SecurityDeposit,
    LocLatitude: this.LocLatitude,
    LocLongitude: this.LocLongitude,
    FeaturesDetail:  JSON.stringify(this.FeaturesList),
    ImagesDetail:  JSON.stringify(this.imagesList),
    UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.dialogRef.close('Update');
        }else{
          this.msg.WarnNotify(Response.msg);
        }
        $('.loaderDark').fadeOut(200);
      },
      (Error:any) => {  
        $('.loaderDark').fadeOut(200);
      }
    )


  }


  update(){

    this.global.openPinCode().subscribe(pin =>{
      
      if(pin != ''){
        $('.loaderDark').show();
        this.http.post(environment.mainApi+this.global.propertyLink+'UpdateProperty',{
          PropertyID : this.PropertyID,
          PropertyTypeID: this.PropertyTypeID,
          PropertyStatusID: this.PropertyStatusID,
          CountryID: this.CountryID,
          CityID: this.CityID,
          AreaID: this.AreaID,
          PropertyTitle: this.PropertyTitle,
          PropertyCode: this.PropertyCode,
          PropertySize: this.PropertySize,
          NoOfRooms: this.NoOfRooms,
          Adult: this.Adult,
          Children: this.Children,
          Bedroom: this.Bedroom,
          Bathroom: this.Bathroom,
          RentPerDay: this.RentPerDay,
          PropertyAddress: this.PropertyAddress,
          PropertyDescription: this.PropertyDescription,
          BuildingDescription: this.BuildingDescription,
          AreaDescription: this.AreaDescription,
          SecurityDeposit: this.SecurityDeposit,
          LocLatitude: this.LocLatitude,
          LocLongitude: this.LocLongitude,
          FeaturesDetail:  JSON.stringify(this.FeaturesList.filter((e:any)=> e.status == true)),
          ImagesDetail:  JSON.stringify(this.imagesList),
          UserID: this.global.getUserID(),
          PinCode : pin
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.dialogRef.close('Update');
              }else{
                this.msg.WarnNotify(Response.msg);
              }

              $('.loaderDark').fadeOut(200);
            },
            (Error:any) => {  
              $('.loaderDark').fadeOut(200);
            }
          )
      }

    })
   
  }

  imagesList:any = [];

  selectImages(e:any){

    
    if(window.File && window.FileReader && window.FileList ){
      const files = e.target.files;
      

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Only process image files (optional check)
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            var list:any = [];
            reader.onload = function (e:any) {
            
                // Create an image element to get the dimensions
                const img = new Image();
                img.onload = function () {
                    const imageDetails = {
                      imgUrl: e.target.result, // Base64 string of the image
                        name:file.name,
                        width: img.width,         
                        height: img.height,       
                        sizeInBytes: file.size ,  
                        sizeInMB: parseFloat((file.size / 1048576).toFixed(2)) ,  // File size in MB's
                        fileName: file.name       
                    };
                    
                    
                    list.push(imageDetails);
                    // console.log(list); // Log the array of image details
                };
              
                img.src = e.target.result; // Set the data URL to the image source
            };
          //  var tmpImgList = list;
          // this.imagesList.push(list);
          
            reader.readAsDataURL(file); // Read the file as a data URL
        }

       
    }    
   setTimeout(() => {
    
    list.forEach((e:any) => {
        this.imagesList.push({propertyImage:e.imgUrl,name:e.name,width:e.width,height:e.height,sizeInMB:e.sizeInMB,fileName:e.fileName});
      });
   }, 1000);
    
    }
    else{
      alert("Your Browser does not support the File API");
    }



  }

  deleteImage(item:any){
    var index = this.imagesList.indexOf(item);
    this.imagesList.splice(index, 1);
  }

  getPropertImages(id:any){
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyImagesDetail?PropertyID='+id).subscribe(
      (Response:any) => {
        Response.forEach((e:any) => {
          this.imagesList.push({propertyImage:e.propertyImage,name:e.name,width:e.width,height:e.height,sizeInMB:e.sizeInMB,fileName:e.fileName});
        });
       
        //console.log(Response);
      }
    )
  }

  getPropertFeatures(id:any){
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyFeaturesDetail?PropertyID='+id).subscribe(
      (Response:any) => {
        Response.forEach((e:any) => {
            this.FeaturesList.forEach((f:any) => {
                if(f.propertyFeatureID == e.propertyFeatureID){
                  f.status = true;
                }
            });
        });
        
        //console.log(Response);
      }
    )
  }


  reset(){

  this.btnType = 'Save';
  this.PropertyID = 0;
  this.PropertyTypeID = 0;
  this.PropertyStatusID = 0;
  this.CountryID = 0;
  this.CityID = 0;
  this.AreaID = 0;
  this.PropertyTitle = '';
  this.PropertyCode = '';
  this.PropertySize = '';
  this.NoOfRooms = '';
  this.Adult = '';
  this.Children = '';
  this.Bedroom = '';
  this.Bathroom = '';
  this.RentPerDay = '';
  this.PropertyAddress = '';
  this.PropertyDescription = '';
  this.BuildingDescription = '';
  this.AreaDescription = "";
  this.SecurityDeposit = 0;
  this.LocLatitude = '';
  this.LocLongitude = '';

  this.btnType = 'Save';
  }

  closeDialogue(){
    this.dialogRef.close();
  }

}

