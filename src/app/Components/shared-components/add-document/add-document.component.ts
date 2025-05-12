import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tick } from '@angular/core/testing';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {


  @Output() UploadEmitter = new EventEmitter();
  @Input() documentList: any = [];
  @Input() billNo: any = '';


  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private global: GlobalDataModule,

  ) {

  }
  ngOnInit(): void {


  }

  getDocument(billNo: any) {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInvDocument?InvBillNo=' + billNo).subscribe(
      (Response: any) => {
        this.documentList = [];
        if (Response.length > 0) {
          this.documentList.push({ docID: 1, eDocName: Response[0].invBillNo, eDocExt: '', eDoc:Response[0].invDocument})
        }
        console.log(Response);
      }
    )
  }


  uploadDocument() {


    const BillNo = this.billNo;
    const document = this.documentList[0].eDoc;

    if (BillNo == '' || BillNo == undefined) {
      this.msg.WarnNotify('Bill No Empty');
      return;
    }
    if (document == '' || document == undefined) {
      this.msg.WarnNotify('No Document selected');
      return;
    }

    console.log(BillNo, document);
    this.http.post(environment.mainApi + this.global.inventoryLink + 'AddInvDocument', {
      InvBillNo: BillNo,
      InvDocument: document,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        console.log(Response);
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.UploadEmitter.emit();
        } else {
          this.msg.WarnNotify(Response.msg);
        }


      }
    )



  }


   removeFile(index: number, item?: any): void {


    if (item.docID > 0) {

      this.global.openPinCode().subscribe(
        (pin: any) => {

        if(pin != ''){
            const BillNo = this.billNo;
          
          this.http.post(environment.mainApi + this.global.inventoryLink + 'DelInvDocument', {
            InvBillNo: BillNo,
            PinCode:pin,
            UserID: this.global.getUserID()
          }).subscribe(
            (Response: any) => {
              console.log(Response);
              if (Response.msg == 'Data Deleted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getDocument(this.billNo);
              } else {
                this.msg.WarnNotify(Response.msg);
              }
            },
            (error: any) => {
              console.log(error)
            }
          )
        }
        }
      )


    } else {
      this.documentList.splice(index, 1);
      setTimeout(() => {
        // this.upload();
      }, 200);
    }
  }




  ////////////////////////////////////////////


  directDownload(item: any) {
    // const fileUrl = filesUrl;
    // const link = document.createElement('a');
    // link.href = fileUrl;
    // link.target = '_blank'; // Open in new tab if download attribute is not supported
    // link.download = 'filename'; // This will force download in supported browsers
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);


    var vdoc = item.eDoc;
    // console.log(vdoc);

    var newImage = vdoc.replace('data:application/pdf;base64,','');

    const byteArray = new Uint8Array(atob(newImage).split('').map(char => char.charCodeAt(0)));

    const file = new Blob([byteArray], { type: 'application/pdf' });

    const fileURl = URL.createObjectURL(file);

    let fileName = this.billNo;
    let link = document.createElement('a');
    link.download = fileName;
    link.target = '_blank';
    link.href = fileURl;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFilesSelected(event: Event): void {

   if(this.documentList.length == 0){
     const input = event.target as HTMLInputElement;
    if (input.files) {

      Array.from(input.files).forEach((file) => {
        var extension = file.type.split('/')[1];
        if (extension == 'pdf') {
          var fileName = file.name;
          const reader = new FileReader();
          reader.onload = (e) => {
            const preview = (e.target as FileReader).result as string;
            //  this.customerDocumentList.push({ file, preview });
            this.documentList.push({ docID: 0, eDocName: fileName, eDocExt: extension, eDoc: preview });

          };
          reader.readAsDataURL(file);

        } else {
          this.msg.WarnNotify('Document Must be PDF')
        }
      });
    }
   }else{
    this.msg.WarnNotify('Document Already Selected')
   }
  }

  onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles.length > 1) {
        this.msg.WarnNotify('Only One Document Allowed');
        return;
      }
      for (let i = 0; i < droppedFiles.length; i++) {
        const file = droppedFiles[i];
        const name = file.name;
        const extension = name.split('.').pop() || '';
        const reader = new FileReader();

        if (extension == 'pdf') {
          reader.onload = () => {
            this.documentList.push({ docID: 0, eDocName: name, eDocExt: extension, eDoc: reader.result });
          };

          reader.readAsDataURL(file); // base64 source
        } else {
          this.msg.WarnNotify('Document Must be PDF')
        }
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

 





}
