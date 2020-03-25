import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeFaq'
})
export class TypeFaqPipe implements PipeTransform {
    transform(items: Array<any>, type: string): Array<any> {
    //   console.log('SHOW ITEM IN FILTERS : ', items);
      if(items && type){
        items[0].open = true;
        return items.filter(item => item.type === type);
      }else{
        return items;
      }
    }
}