import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'input:not([autocomplete]), textarea:not([autocomplete])' // Target all input and textarea fields
})


export class DisableAutocompleteDirective {

    constructor(private el: ElementRef, private renderer: Renderer2) {
   
      this.renderer.setAttribute(this.el.nativeElement, 'autocomplete', 'off');
    
  }

}
