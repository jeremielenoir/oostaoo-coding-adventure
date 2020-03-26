import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeFaq'
})
export class TypeFaqPipe implements PipeTransform {
  newItems: Array<any>;
    transform(items: Array<any>, type: string): Array<any> {
    //   console.log('SHOW ITEM IN FILTERS : ', items);
      if(items && type){
        this.newItems = items.filter(item => item.type === type);
        this.newItems[0].open = true;
        return this.newItems;
      }else{
        return items;
      }
    }
}