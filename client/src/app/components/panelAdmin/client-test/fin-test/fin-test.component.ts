import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ApiClientService, API_URI_FEEDBACK } from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-fin-test',
  templateUrl: './fin-test.component.html',
  styleUrls: ['./fin-test.component.scss']
})
export class FinTestComponent {
  @Input() campaignId = 0;
  public rating = 0;
  public commentaire = new FormControl('');

  constructor(private apiClientService: ApiClientService, private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['mat-snack-bar-container']
    });
  }

  getRating(rate: number) {
    this.rating = rate;
  }

  sendFeedback() {
    if (this.rating >= 0 && this.rating <= 5) {
      this.apiClientService.post(API_URI_FEEDBACK, {
        commentaires: this.commentaire.value,
        rating: this.rating,
        campaignId: this.campaignId
      }).subscribe(
        _ => this.openSnackBar('Nous vous remercions pour votre retour', 'Fermer'),
        err => console.log(err)
      );
    }
  }
}
