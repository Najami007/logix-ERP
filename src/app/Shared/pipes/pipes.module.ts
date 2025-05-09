import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter/filter.pipe';
import { SearchPipe } from '../Pipe/SearchPipe/search.pipe';



@NgModule({
  declarations: [
    FilterPipe,
    SearchPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FilterPipe,
    SearchPipe
  ]
})
export class PipesModule { }
