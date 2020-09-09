import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QUESTION_SEPARATOR ,ApiClientService } from 'src/app/api-client/api-client.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

@Component({
  selector: 'app-response-formated',
  templateUrl: './response-formated.component.html',
  styleUrls: ['./response-formated.component.scss']
})
export class ResponseFormatedComponent implements OnInit, OnChanges {
  
  @Input() question: any;
  
  showedResponses: Array<string>;
  trueResponses: Array<string>;
  
  public currentLanguage: string;
  public testMarkdown: string = `## Markdown __rulez__!
  ---
  
  ### Syntax highlight
  \`\`\`javascript
  const language = 'typescript';
  \`\`\`
  
  ### Lists
  1. Ordered list
  2. Another bullet point
    - Unordered list
    - Another unordered bullet point
  
  ### Blockquote
  > Blockquote to the max`;

  constructor(public languageStorage: SelectedLanguageService) {
    this.currentLanguage = this.languageStorage.getLanguageCountry() !== '' ? this.languageStorage.getLanguageCountry() == 'fr-FR' ? '' : '_' + this.languageStorage.getLanguageCountry() : '';
    console.log('LANGUAGE', this.languageStorage.getLanguageCountry());
  }

  ngOnInit() {
    
  }

  onReady(){
    console.log("onReady mark-down")
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.currentLanguage);
    if (this.question['content' + this.currentLanguage]) {
      
      this.showedResponses = [...this.question['content' + this.currentLanguage].split(QUESTION_SEPARATOR)];
      
    }
      
    if (this.question['answer_value' + this.currentLanguage]) {
        
        this.trueResponses = [...this.question['answer_value' + this.currentLanguage].split(QUESTION_SEPARATOR)];
        //console.log('QUESTION', this.question);
      }
   }
  
}
