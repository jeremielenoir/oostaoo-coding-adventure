import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
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
              public dialog: MatDialog) {
  }
  public form: FormGroup;
  public contactList: FormArray;
  @Input() globalId: string;
  public campaigns: any;
  candidatId: any;

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
  // method triggered when form is submitted
  submit() {
    console.log('this.form.value.contacts: ', this.form.value.contacts);
  }

  openDialog() {
      this.dialog.open(CandidatsMailComponent, {
        data: {
          globalId: this.globalId,
          contact: this.form.value.contacts,
        },
        height: '80vh'
      });
  }
}
