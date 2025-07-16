import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableAutocompleteDirective } from './autocomplete-directive/disable-autocomplete.directive';



@NgModule({
  declarations: [DisableAutocompleteDirective],
  imports: [
    CommonModule
  ],
  exports: [
    DisableAutocompleteDirective
  ]
})
export class DirectivesModule { }
