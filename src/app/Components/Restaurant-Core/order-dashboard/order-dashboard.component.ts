import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { interval, Subscription } from 'rxjs';



@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss']
})


export class OrderDashboardComponent implements OnInit {

  mySubscription: Subscription;
  constructor(
    private http: HttpClient,
    private global: GlobalDataModule,
    private msg: NotificationService,
    private app: AppComponent,
    private dialog: MatDialog
  ) {

    this.mySubscription = interval(10000).subscribe((x => {
      this.getOrderList();
      this.getVoidList();
    }));
  }



  ngOnInit(): void {
    this.global.setHeaderTitle('Kitchen DashBoard');
    this.getVoidList();
    this.getOrderList();
    this.getCookingArea();
    
    // this.beep();

  }

  locationID = this.global.getOrderDsbLocation() == '' ? 0 : this.global.getOrderDsbLocation();
  curDate = new Date()

  voidOrderList: any = [];
  filterVoidOrderList:any = [];
  tempVoidList: any = [];
  newOrderList: any = [];
  filterNewOrderList:any = [];
  tempOrderList: any = [];

  PendingOrderList: any = [];
 filterPendingOrderList: any = [];
  deliveredOrderList: any = [];
  filterDeliveredOrderList: any = [];
  orderDetailList:any = [];

  sound: any = "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=";

 
  cookingAreaList: any = [];



  getCookingArea() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetCookingAria').subscribe(
      (Response: any) => {
        this.cookingAreaList = Response;
        
      }
    )
  }



  getVoidList() {
    var type = '';
    if(this.locationID == 0){
      type = 'void';
    }else{
      type = 'locwisevoid&locid='+this.locationID;
    }

    this.tempVoidList = this.voidOrderList;

    this.http.get(environment.mainApi+this.global.restaurentLink+'GetOrdersAndVoidItemsDetail?todate='+this.global.dateFormater(this.curDate, '-')
    +'&type='+type).subscribe(
      (Response: any) => {
        this.voidOrderList = [];
        this.voidOrderList = Response;

        this.filterVoidOrderList = this.filterUniqueValues(this.voidOrderList);
      

        if (this.tempVoidList != '' && (this.voidOrderList.length > this.tempVoidList.length)) {
   
          this.beep();
        }


      }
    )
  }



   filterUniqueValues<T>(array: any[]): any[] {
    const uniqueSet = new Set<string>();
    const uniqueArray: T[] = [];
  
    array.forEach(item => {
      const key = JSON.stringify(item.orderNo);
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        uniqueArray.push(item);
      }
    });
  
    return uniqueArray;
  }

  getOrderList() {
    // if (this.newOrderList != '') {
    //   this.tempOrderList = this.newOrderList;
    // }else{
    //   this.tempOrderList = [];
    // }
    this.tempOrderList = this.newOrderList;
    // alert(this.tempOrderList.length);

    var type = '';
    if(this.locationID == 0){
      type = 'order';
    }else{
      type = 'locwiseorder&locid='+this.locationID;
    }

   
 
    this.http.get(environment.mainApi+this.global.restaurentLink +'GetOrdersAndVoidItemsDetail?todate='+this.global.dateFormater(this.curDate,'-') +
    '&type='+type).subscribe(
      (Response: any) => {
        this.PendingOrderList = [];
        this.newOrderList = [];
        this.deliveredOrderList = [];
       
       if(Response != null){

        this.newOrderList = Response.filter((e:any)=> e.reqStatus == false);
        this.PendingOrderList = Response.filter((e:any)=> e.reqStatus == true && e.dStatus == false);
        this.deliveredOrderList = Response.filter((e:any)=> e.reqStatus == true && e.dStatus == true);

        this.filterNewOrderList = this.filterUniqueValues(this.newOrderList);
        this.filterPendingOrderList =this.filterUniqueValues(this.PendingOrderList);
        this.filterDeliveredOrderList =this.filterUniqueValues(this.deliveredOrderList);
        
       }

      
        if (this.newOrderList.length > this.tempOrderList.length) {
      
          this.beep();
        }
  



      }
    )
  }

  detailType = '';
  detailOrderNo  = '';
  myRemarks = '';
  getOrderDetail(type:any,item:any){

    this.orderDetailList = [];
    this.detailType = type + ' Order';
    this.detailOrderNo = item.orderNo;
    this.myRemarks = item.remarks;

    if(type == 'new'){
      this.orderDetailList = this.newOrderList.filter((e:any)=> e.orderNo == item.orderNo);
    }
    if(type == 'pending'){
      this.orderDetailList = this.PendingOrderList.filter((e:any)=> e.orderNo == item.orderNo);
    }
    if(type == 'deliver'){
      this.orderDetailList = this.deliveredOrderList.filter((e:any)=> e.orderNo == item.orderNo);
    }
    if(type == 'void'){
      this.orderDetailList = this.voidOrderList.filter((e:any)=> e.orderNo == item.orderNo);
    }
  }


  onDocSelected(event: any) {



    let targetEvent = event.target;

    let file: File = targetEvent.files[0];

    let fileReader: FileReader = new FileReader();

    var Sound2:any = '';


    fileReader.readAsDataURL(file);
  
    fileReader.onload = (e) => {
      this.sound = fileReader.result;
      localStorage.setItem('snd', JSON.stringify(fileReader.result));
      
    }
   
    new Audio(Sound2).play()

    // this.beep()



  }


  beep() {

   

    // var doc:any =  document.querySelector('boom');
    // doc.play();
    // var voice = new Audio(this.sound);
  //  var voice = new Audio(this.sound); 
   var voice = new Audio(JSON.parse(localStorage.getItem('snd') || '{}'));
    voice.play();
  }



  approveOrder(item: any) {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.restaurentLink + 'ApproveOrderVoidRequest', {
      AutoInvDetID: item.autoInvDetID,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Approved Successfully') {
          this.msg.SuccessNotify('Accepted');

          this.getOrderList();
          this.getVoidList();
        } else {
          this.msg.WarnNotify(Response.msg);
        }

        this.app.stopLoaderDark();
      }
    )
  }


  ApproveDelivery(item: any) {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.global.restaurentLink+'UpdateDeliveryStatus', {
      AutoInvDetID: item.autoInvDetID,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Deliver Successfully') {
          this.msg.SuccessNotify('Order Delivered');

          this.getOrderList();
        } else {
          this.msg.WarnNotify(Response.msg);
        }

        this.app.stopLoaderDark();
      }
    )
  }

}
