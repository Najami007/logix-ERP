import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  // transform(items: any[],  searchKey: string , searchText: string): any[] {
  //   if (!items || !searchText || !searchKey) return items;

  //   searchText = searchText.toLowerCase();

 

  //   return items.filter(item =>
  //     item[searchKey]?.toString().toLowerCase().includes(searchText)
  //   );
  // }

  public transform(value: any, keys: string, term: string): any[] {

    if (!term) return value;
    return (value || []).filter((item: any) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  }

}
