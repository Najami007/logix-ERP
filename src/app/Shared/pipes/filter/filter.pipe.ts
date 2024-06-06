import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  

  transform(data: any[], searchTerm: string, searchProperty?: string): any[] {
    if (!data || !searchTerm) {
      return data;
    }

    searchTerm = searchTerm.toLowerCase();

    if (searchProperty) {
      return data.filter(item => item[searchProperty].toLowerCase().includes(searchTerm));
    } else {
      return data.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
    }
  }

  // transform(items: any[], searchText: string): any[] {
  //   if (!items) return [];
  //   if (!searchText) return items;
    

  //   searchText = searchText.toLowerCase();
  //   // alert(searchText);
  //   return items.filter((it) => {

  //     return  it.name.toLowerCase().includes(searchText);
  //   });
  // }

}
