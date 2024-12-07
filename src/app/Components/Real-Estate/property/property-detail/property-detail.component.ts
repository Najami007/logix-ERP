import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {


  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<PropertyDetailComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
  ){

  }
  ngOnInit(): void {

    if(this.editData){
      this.getPropertImages(this.editData.data.propertyID);
      this.getPropertFeatures(this.editData.data.propertyID);
      this.myPropertyID = this.editData.data.propertyID;
      this.myPropertyType = this.editData.data.propertyTypeTitle;
      this.myPropertyStatus = this.editData.data.propertyStatusTitle;
      this.myCountryName = this.editData.data.countryName;
      this.myCityName = this.editData.data.cityName;
      this.myAreaName = this.editData.data.areaTitle;
      this.myPropertyTitle = this.editData.data.propertyTitle;
      this.myPropertyCode = this.editData.data.propertyCode;
      this.myPropertySize = this.editData.data.propertySize;
      this.myNoOfRooms = this.editData.data.noOfRooms;
      this.myAdult = this.editData.data.adult;
      this.myChildren = this.editData.data.children;
      this.myBedroom = this.editData.data.bedroom;
      this.myBathroom = this.editData.data.bathroom;
      this.myRentPerDay = this.editData.data.rentPerDay;
      this.myPropertyAddress = this.editData.data.propertyAddress;
      this.myPropertyDescription = this.editData.data.propertyDescription;
      this.myBuildingDescription = this.editData.data.buildingDescription;
      this.myAreaDescription = this.editData.data.areaDescription;
      this.mySecurityDeposit = this.editData.data.securityDeposit;
      this.myLocLatitude = this.editData.data.locLatitude;
      this.myLocLongitude = this.editData.data.locLongitude;
    
           }
        }


        myPropertyID = 0;
        myPropertyTypeID = 0;
        myPropertyStatusID = 0;
        myCountryID = 0;
        myCityID = 0;
        myPropertyType = '';
        myAreaID = 0;
        myPropertyTitle = '';
        myPropertyCode = '';
        myPropertySize = '';
        myNoOfRooms = '';
        myAdult = '';
        myChildren = '';
        myBedroom = '';
        myBathroom = '';
        myRentPerDay = '';
        myCityName = '';
        myCountryName = '';
        myAreaName = '';
        myPropertyAddress = '';
        myPropertyDescription = '';
        myBuildingDescription = '';
        myAreaDescription = "";
        mySecurityDeposit = 0;
        myLocLatitude:any = '';
        myLocLongitude:any = '';
        myPropertyStatus = '';




  myImagesList:any = [];
  myFeaturesList:any = [];
  myFeatureCatList:any = [];


  getPropertImages(id:any){
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyImagesDetail?PropertyID='+id).subscribe(
      (Response:any) => {

        Response.forEach((e:any) => {
          this.myImagesList.push({image:e.propertyImage,alt:'Img Not Found',thumbImage:e.propertyImage});
        });
             }
    )
  }

  getPropertFeatures(id:any){
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetPropertyFeaturesDetail?PropertyID='+id).subscribe(
      (Response:any) => {
        this.myFeaturesList = Response;
       this.myFeatureCatList = this.filterUniqueValues(Response);
       }
    )
  }

  public filterUniqueValues<T>(array: any): T[] {
    const uniqueSet = new Set<string>();
    const uniqueArray: T[] = [];
  
    array.forEach(item => {
      const key = JSON.stringify(item.propertyCategoryTitle);
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        uniqueArray.push(item);
      }
    });
  
    return uniqueArray;
  }



  closeDialogue(){
    this.dialogRef.close();
  }


}
