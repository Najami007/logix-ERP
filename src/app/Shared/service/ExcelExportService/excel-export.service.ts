import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportDataToExcel(data: any[], fileName: string): void {
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // Write to Excel and save
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveDataAsExcelFile(excelBuffer, fileName);
  }

  private saveDataAsExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  }



  
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

 exportTableToExcel(tableID:any,fileName:any): void {
   // Get the table element
   const tableElement = document.getElementById(tableID);
   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

   // Create a new workbook and append the worksheet
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   // Write the workbook and save
   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
   this.saveTableAsExcelFile(excelBuffer, fileName);
 }

 private saveTableAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
   saveAs(data, fileName + this.EXCEL_EXTENSION);
 }
}
