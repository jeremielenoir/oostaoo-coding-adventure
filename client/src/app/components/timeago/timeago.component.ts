import { Component, Input } from '@angular/core';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
// import { strings as englishShortStrings } from 'ngx-timeago/language-strings/en-short';
import { strings as frenchStrings } from 'ngx-timeago/language-strings/fr';
import { strings as spanishStrings } from 'ngx-timeago/language-strings/es';
import { strings as japaneseStrings } from 'ngx-timeago/language-strings/ja';
// import { strings as frenchShortStrings } from 'ngx-timeago/language-strings/fr-short';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

@Component({
  selector: 'app-timeago',
  templateUrl: './timeago.component.html',
  styleUrls: ['./timeago.component.css'],

})
export class TimeagoComponent {
  @Input() date: any = '';
  live = true;


  constructor(private intl: TimeagoIntl, public languageService: SelectedLanguageService) {
    const lang = this.languageService.getLanguageCountry();
    this.intl.strings = frenchStrings;
    switch (lang) {
      case 'es-ES': this.intl.strings = spanishStrings; break;
      case 'fr-FR': this.intl.strings = frenchStrings; break;
      case 'en-US': this.intl.strings = englishStrings; break;
      case 'jp-JP': this.intl.strings = japaneseStrings; break;
      default: this.intl.strings = frenchStrings; break;

    }


    this.intl.changes.next();

  }


}
