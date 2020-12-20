import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interfaces/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chats: Mensaje[] = [];
  public usuario: any = {};
  private itemsCollections: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(user => {

      if (!user) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
              }

  login(proveedor: string) {
    if (proveedor === 'google') {
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.signOut();
  }

  cargarMensajes() {
    this.itemsCollections = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
                                                        .limit(5));

    return this.itemsCollections.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        console.log(mensajes);
        this.chats = [];
        for (const mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;
      }));
  }

  agregarMensaje(texto: string) {

    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    return this.itemsCollections.add(mensaje);

  }
}
