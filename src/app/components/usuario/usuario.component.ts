import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-usuarios',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuariosDetailsComponent {

  usuario = new Usuario(0, '', '', '');
  confirmarSenha: string = '';

  router2 = inject(Router);

  salvar(){
    if (this.usuario.senha !== this.confirmarSenha) {
      Swal.fire({
        title: 'As senhas não conferem!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Usuário cadastrado com sucesso!',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    this.router2.navigate(['/login']);
  }
}
