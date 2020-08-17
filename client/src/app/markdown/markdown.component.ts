import * as marked from 'marked';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'markdown', 
    template: `
      <div [innerHTML]="convertedData">
      </div>
    `
  })
  export class MarkdownComponent {
    @Input('data')
    data: string;
    convertedData: string;
    
    ngOnChanges() { 
      var md = marked.setOptions({});
      this.convertedData = md.parse(this.data);
    }
  }