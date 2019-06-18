import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { API_URI_CANDIDATS, ApiClientService } from 'src/app/api-client/api-client.service';
import { MatDialog } from '@angular/material';
import { CandidatsMailComponent } from '../candidats-mail/candidats-mail.component';

@Component({
  selector: 'app-candidats-form',
  templateUrl: './candidats-form.component.html',
  styleUrls: ['./candidats-form.component.css']
})
export class CandidatsFormComponent implements OnInit {

  // returns all form groups under contacts
  get contactFormGroup() {
    return this.form.get('contacts') as FormArray;
  }

  constructor(private fb: FormBuilder,
    public apiClientService: ApiClientService,
    public dialog: MatDialog) {
  }
  public form: FormGroup;
  public contactList: FormArray;
  @Input() globalId: string;
  public campaigns: any;
  candidatId: any;
  arrayCandidat: Array<{ id: number }> = [];

  ngOnInit() {
    this.form = this.fb.group({
      contacts: this.fb.array([this.createContact()])
    });

    // set contactlist to this field
    this.contactList = this.form.get('contacts') as FormArray;
  }

  // contact formgroup
  createContact(): FormGroup {
    return this.fb.group({
      type: ['email', Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      value: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }

  // add a contact form group
  addContact() {
    this.contactList.push(this.createContact());
  }

  // remove contact from group
  removeContact(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.contactList.removeAt(index);
  }


  // get the formgroup under contacts form array
  getContactsFormGroup(index): FormGroup {
    // this.contactList = this.form.get('contacts') as FormArray;
    const formGroup = this.contactList.controls[index] as FormGroup;
    return formGroup;
  }

  postCandidat(nom, email) {
    this.apiClientService.post(API_URI_CANDIDATS, {
      Nom: nom,
      email: email,
    }).subscribe(
      (res) => {
        this.arrayCandidat.push({ id: res.id });
        console.log('id candidats', this.arrayCandidat);
      },
      err => console.log(err)
    );
  }
  // method triggered when form is submitted
  submit() {
    console.log(this.form.value.contacts);
    for (let i = 0; i < this.form.value.contacts.length; i++) {
      const item = this.form.value.contacts[i];
      const nom = item.name;
      const email = item.value;
      this.postCandidat(nom, email);
    }
  }

  openDialog() {
    console.log(this.arrayCandidat);
    this.dialog.open(CandidatsMailComponent, {
      data: {
        globalId: this.globalId,
        candidatId: this.arrayCandidat,
      },
      height: '80vh'
    });
  }
}
