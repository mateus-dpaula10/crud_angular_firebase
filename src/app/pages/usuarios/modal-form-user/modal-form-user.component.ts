import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../interfaces/user';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-modal-form-user',
  templateUrl: './modal-form-user.component.html',
  styleUrl: './modal-form-user.component.css'
})
export class ModalFormUserComponent {
  formUser: FormGroup;
  editUser: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalFormUserComponent>,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.builderForm();
    if (this.data && this.data.name) {
      this.editUser = true;
    }
  }

  saveUser() {
    const objUserForm: User = this.formUser.getRawValue();

    if (this.data && this.data.name) {
      this.userService.updateUser(this.data.firebaseId, objUserForm)
      .then(
        (response: any) => {
          window.alert('Usuário editado com sucesso!'),
          this.closeModal()
        }
      )
      .catch(err => { 
        window.alert('Houve um erro ao cadastrar o usuário!')
        console.log(err) 
      })
    } else {
      this.userService.addUser(objUserForm)
      .then(
        (response: any) => {
          window.alert('Usuário cadastrado com sucesso!'),
          this.closeModal()
        }
      )
      .catch(err => { 
        window.alert('Houve um erro ao cadastrar o usuário!')
        console.log(err) 
      })
    }
  }

  builderForm() {
    this.formUser = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      sector: [null, [Validators.required, Validators.minLength(2)]],
      role: [null, [Validators.required, Validators.minLength(5)]]
    });

    if (this.data && this.data.name) {
      this.fillForm();
    }
  }

  fillForm() {
    this.formUser.patchValue({
      name: this.data.name,
      email: this.data.email,
      sector: this.data.sector,
      role: this.data.role
    })
  }

  closeModal() {
    this.dialogRef.close();
  }
}
