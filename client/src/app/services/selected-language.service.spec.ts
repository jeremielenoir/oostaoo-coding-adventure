import { TestBed } from '@angular/core/testing';

import { SelectedLanguageService } from './selected-language.service';

describe('SelectedLanguageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedLanguageService = TestBed.get(SelectedLanguageService);
    expect(service).toBeTruthy();
  });
});
