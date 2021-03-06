import { Component, OnInit } from '@angular/core';
import { ChatService } from "../../services/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje = '';
  elemento: any;

  enviar_mensaje() {
    console.log(this.mensaje);
    if (this.mensaje.length == 0) {
      return;
    }

    this._cs.agregarMensaje(this.mensaje).then(() => this.mensaje = '' ).catch((err) => console.error('Error al enviar', err));
  }

  constructor(public _cs: ChatService) {
    console.log('INGRESO AL CONSTRUCTOR');

    this._cs.cargarMensajes().subscribe(() => {
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);

    });
  }


  ngOnInit(): void {

    this.elemento = document.getElementById('app-mensajes');

  }



}
