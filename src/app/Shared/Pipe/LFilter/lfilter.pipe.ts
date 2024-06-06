import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lFilter'
})
export class LFilterPipe implements PipeTransform {


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
}


