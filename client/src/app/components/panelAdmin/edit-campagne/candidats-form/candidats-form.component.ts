import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CandidatsMailComponent } from '../candidats-mail/candidats-mail.component';
import { DecryptTokenService } from "../../../home/register/register.service";

@Component({
  selector: 'app-candidats-form',
  templateUrl: './candidats-form.component.html',
  styleUrls: ['./candidats-form.component.scss']
})
export class CandidatsFormComponent implements OnInit {
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

  // returns all form groups under contacts
  get contactFormGroup() {
    return this.form.get('contacts') as FormArray;
  }

  constructor(private fb: FormBuilder, public dialog: MatDialog, private _snackBar: MatSnackBar,) { }
  @Input() globalId: string;
  public form: FormGroup;
  public contactList: FormArray;
  public campaigns: any;
  candidatId: any;
  private decryptTokenService = new DecryptTokenService();

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
      name: [null, Validators.compose([Validators.required])],
      value: [null, Validators.compose([
        Validators.required,
        Validators.pattern(this.emailRegex)])]
    });
  }
  // add a contact form group
  addContact() {
    if (this.contactList.length < this.decryptTokenService.tests_available) {
      this.contactList.push(this.createContact());
    } else {
      this.openSnackBar("Limite de test disponibles atteinte", "Fermer");
    }
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

  validate(): boolean {
    // TODO : try to refacto with angular getError function ?
    return !this.form.controls["contacts"]["controls"].map(control => {
      return control.controls.name.errors === null && control.controls.value.errors === null;
    }).includes(false);
  }

  submit() {
    console.log('CandidatsFormComponent submit() > this.form.value.contacts: ', this.form.value.contacts);
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  openDialogMail() {
    this.dialog.open(CandidatsMailComponent, {
      data: {
        globalId: this.globalId,
        contact: this.form.value.contacts,
      },
      height: '580px'
    });
  }
}
