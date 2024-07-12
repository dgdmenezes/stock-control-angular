import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../../services/user/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email:["", Validators.required],
    password:["", Validators.required]
  })

  singupForm = this.formBuilder.group({
    name:["", Validators.required],
    email:["",Validators.required],
    password:["",Validators.required]
  })

  constructor(
    private formBuilder:FormBuilder,
    private userService:UserService,
    private cookieService:CookieService,
    private mesageService:MessageService
  ) {}

  onSubmitLoginForm():void{
    if (this.loginForm.value && this.loginForm.valid){
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .subscribe({
        next:(response) =>{
          if(response){
            this.cookieService.set("USER_INFO", response?.token);
            this.loginForm.reset()

            this.mesageService.add({
              severity:'success',
              summary:'Sucesso',
              detail: `Bem-vindo de volta ${response?.name}!`,
              life: 2000,
            })
          }

        },
        error:(err) => {
          this.mesageService.add({
            severity:'error',
            summary:'Erro',
            detail: `Erro ao fazer login!`,
            life: 2000,
          })
          this.loginForm.reset()
          console.log(err);

        }

      })
    }


  }

  onSubmitSignupForm():void{
    if(this.singupForm.value && this.singupForm.valid){
    this.userService.signupUser(this.singupForm.value as SignupUserRequest)
      .subscribe({
        next: (response) =>{
          if(response){
            this.singupForm.reset();
            this.loginCard = true;

            this.mesageService.add({
              severity:'success',
              summary:'Sucesso',
              detail: `Usuário Criado com Sucesso!`,
              life: 2000,
            })

          }
        },
        error:(err) => {
          this.mesageService.add({
            severity:'error',
            summary:'Erro',
            detail: `Erro ao Cadastra Usuário!`,
            life: 2000,
          })

          console.log(err);

        }

      })
      }
  }

}
//console.log("Dados do formulario de criação de conta", this.singupForm.value);