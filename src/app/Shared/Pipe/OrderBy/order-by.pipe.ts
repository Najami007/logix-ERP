import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, order: "asc" | "desc" = "asc",orderVar:any) {
    return value.sort((a:any, b:any) => {
      if (order === "asc") {
        return a.orderVar - b.orderVar;
      } else if (order === "desc") {
        return b.orderVar - a.orderVar;
      }
      return 0;
    });
  }

}
