import { Injectable } from '@angular/core';
import {MensajeServidor, Mensaje, CifradoRSA, CifradoAES} from '../model/modelo'
import * as bigintConversion from 'bigint-conversion';
//import { keyAES } from '../modelos/modelos-aes';
import { generateKeys, rsaKeyPair, RsaPublicKey } from '../model/rsa';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CifrarService {

  keyRSAPublicaServidor: RsaPublicKey;

  constructor(private http: HttpClient) { }

  getClave(): Observable<RsaPublicKey>{
    return this.http.get<RsaPublicKey>(environment.apiURL + "/rsa/clave");
  }

  getClave2(): any{
    return this.http.get(environment.apiURL + "/rsa/clave");
  }


  enviarMensajeRSA(mensaje: any){
    return this.http.post(environment.apiURL + "/rsa/mensajeD", mensaje);
  }

  enviarMensajeRSAHash(mensaje: any){
    return this.http.post(environment.apiURL + "/rsa/mensajeDHash", mensaje);
  }


  firmarRSAServ(mensaje: any){
    return this.http.post(environment.apiURL + "/rsa/signServer", mensaje);
  }

  votarRSA(mensaje: any){
    return this.http.post(environment.apiURL + "/rsa/votarServ", mensaje);
  }

  getRecuento(): any{
    return this.http.get(environment.apiURL + "/rsa/recuento");
  }


  getSecretSharedKeys(mensaje: any){
    return this.http.post(environment.apiURL + "/rsa/getSecretSharedKeys", mensaje);
  }

  recoverySharedSecret(mensaje: any){
    return this.http.post(environment.apiURL + "/rsa/recoverySharedSecret", mensaje);
  }


  getPaillierKeys(): any{
    return this.http.get(environment.apiURL + "/rsa/getPaillierKeys");
  }


  getRecuentoVotosHomomorfico(mensaje: any){
    return this.http.post(environment.apiURL + "/rsa/getRecuentoVotosHomomorfico", mensaje);
  }

  /* async cifrarRSA(mensaje: Uint8Array): Promise<CifradoRSA> {
    let keyTemporalAES = new keyAES();
    await keyTemporalAES.setup();
    const mensajeCifrado: CifradoAES = await keyTemporalAES.cifrar(mensaje);
    const clave: Uint8Array = await keyTemporalAES.exportarClave();
    const claveCifrada: bigint = this.keyRSAPublicaServidor.encrypt(bigintConversion.bufToBigint(clave))
    const enviar: CifradoRSA = {
      cifrado: mensajeCifrado,
      clave: bigintConversion.bigintToHex(claveCifrada)
    }

    return enviar;
  } */

  enviarCifrado(enviar: MensajeServidor): Observable<MensajeServidor> {
    return this.http.post<MensajeServidor>(environment.apiURL + "/mensaje", enviar);
  }
}
