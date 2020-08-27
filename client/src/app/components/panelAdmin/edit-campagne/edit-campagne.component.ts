import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-campagne',
  templateUrl: './edit-campagne.component.html',
  styleUrls: ['./edit-campagne.component.scss']
})
export class EditCampagneComponent implements OnInit {

  public globalId: string;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.globalId = params.id;
    });
  }

  ngOnInit() {
  }
}
