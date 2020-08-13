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

  constructor(public languageStorage: SelectedLanguageService) {
    this.currentLanguage = this.languageStorage.getLanguageCountry() == 'fr-FR' ? '' : '_' + this.languageStorage.getLanguageCountry();
    console.log('LANGUAGE', this.languageStorage.getLanguageCountry());
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.question['content' + this.currentLanguage]) {
      
      this.showedResponses = [...this.question['content' + this.currentLanguage].split(QUESTION_SEPARATOR)];
      console.log('QUESTION', this.showedResponses);
    }
      
    if (this.question['answer_value' + this.currentLanguage]) {
        
        this.trueResponses = [...this.question['answer_value' + this.currentLanguage].split(QUESTION_SEPARATOR)];
        //console.log('QUESTION', this.question);
      }
   }
  
}
