import {Component, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  anioPublicacion: number;
  editorial: string;
  estadoLibro: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  libros: Libro[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  public readonly title = signal('front');
  public readonly usuarios = signal<Usuario[] | null>(null);
  public readonly cargando = signal(false);

  private readonly API = 'http://localhost:8080/admin/usuarios';
  private readonly authHeader = 'Basic ' + btoa('admin:adminpass');

  constructor(private http: HttpClient) {
  }

  public fetchUsuarios(): void {
    this.cargando.set(true);
    const headers = new HttpHeaders({Authorization: this.authHeader});
    this.http.get<Usuario[]>(this.API, {headers}).subscribe({
      next: data => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: err => {
        console.error('Error fetching usuarios', err);
        this.usuarios.set([]);
        this.cargando.set(false);
      }
    });
  }

  public clearUsuarios(): void {
    this.usuarios.set(null);
  }
}
