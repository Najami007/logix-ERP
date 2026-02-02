import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PincodeComponent } from '../pincode/pincode.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {


  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<PincodeComponent>,
    public global: GlobalDataModule
  ) { }

  ngOnInit(): void {


  }

  title:any = 'Alert!';
  modalText:any = 'Cofirm to Proceed!';


  save(){

  }
  
  closeDialogue(){
    this.dialogRef.close('');
  }


}
