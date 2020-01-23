import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-test-mail',
  templateUrl: './test-mail.component.html',
  styleUrls: ['./test-mail.component.scss']
})
export class TestMailComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<any>) { }

  testMailForm: any

  ngOnInit() {
    this.getAddUserForm();
  }


  getAddUserForm() {
    this.testMailForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    })
  }

  close() {
    this.dialogRef.close();
  }

}
