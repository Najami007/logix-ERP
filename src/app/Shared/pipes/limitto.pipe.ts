import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitto'
})
export class LimittoPipe implements PipeTransform {

  // transform(value: string, limit: number) : string {

  //   let trail = '...';

  //   return value.length > limit ? value.substring(0, limit) + trail : value;
  // }

  transform(value:any, args: any) : any {
    // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    // let trail = args.length > 1 ? args[1] : '...';
    // let limit = args ? parseInt(args, 10) : 10;
    let trail = '...';

    return value.length > args ? value.substring(0, args) + trail : value;
  }
}
