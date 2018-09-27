import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList'
})
export class FilterListPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText || searchText=="" || searchText.trim().length == 0) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.text.toLowerCase().includes(searchText);
    });
  }

}
