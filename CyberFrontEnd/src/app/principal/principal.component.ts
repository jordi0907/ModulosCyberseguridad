import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajeServidor, Mensaje, CifradoRSA } from '../model/modelo';
import { generateKeys, rsaKeyPair, RsaPublicKey, RsaPrivateKey, Cegador } from '../model/rsa';
import { AuthService } from '../services/auth.service';

//import * as cryptojs from 'crypto';
import * as sha from 'object-sha'

import { persona } from '../model/persona';
import { CifrarService } from '../services/cifrar.service';
import { PersonaService } from '../services/persona.service';
import * as bigintConversion from 'bigint-conversion';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  mensaje: string;
  mensajeVerif: string;
  mensajes: Mensaje[] = [];
  errorMensaje: Boolean = false;
  errorsecretSharing: Boolean = false;
  personas: persona[];
  keyPair: RsaPublicKey;
  keyPair2;
  keyPair2Priv;
  claveRSApubServ: RsaPublicKey;
  cegador: Cegador;
  hash;
  voto;
  claveRSACliente: rsaKeyPair;
  mensajeCompartido;
  keysShared: number;
  keysThreshold: number=0;
  sharedSecretsKeys;
  keysRecovery: string[] = [];
  secretRecovery:any;
  errorSecretRecovery: Boolean = false;

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private cifrarClave: CifrarService,
    private cifrarRSA: CifrarService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cifrarRSA.getClave2().subscribe(
      async (res) => {
        //console.log(res);

        this.claveRSApubServ = new RsaPublicKey( //clave publica servidor
          bigintConversion.hexToBigint(res.e),
          bigintConversion.hexToBigint(res.n)
        );
        console.log("******** inicio de la aplicacion ********")
        console.log("1. recogemos clave publica del servidor ")
        console.log('clave publica servidor',   this.claveRSApubServ);
        console.log("2. instanciamos el cegador con una r y clave publica del servidor ")
        this.cegador = new Cegador(this.claveRSApubServ)
        console.log('instancia del cegador',  this.cegador);
      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida de la clave publica', '', 'error');
      }
    )

     generateKeys(2048).then(data=>{
        this.claveRSACliente = data
        console.log("3. creamos claves RSA del cliente")
        console.log("las clave del cliente privada ", this.claveRSACliente.privateKey , " y publica", this.claveRSACliente.publicKey)
    });

  }

  modificar(personaId) {
    this.router.navigate(['/' + personaId]);
  }

  async enviarRSA(): Promise<void> {
    if (this.mensaje === undefined || this.mensaje === '') {
      this.errorMensaje = true;

      return;
    }

    this.errorMensaje = false;
    let clave: RsaPublicKey;


    this.cifrarRSA.getClave2().subscribe(
      async (res) => {
        //console.log(res);

        this.keyPair2 = new RsaPublicKey(
          bigintConversion.hexToBigint(res.e),
          bigintConversion.hexToBigint(res.n)
        );
        //console.log('keypair2', this.keyPair2);
        const mensajecifrado2: bigint = await this.keyPair2.encrypt(
          bigintConversion.textToBigint(this.mensaje)
        );
        console.log("***********. Cifrar RSA *********** ")
        console.log('1 mensaje cifrado con publica del servidor', mensajecifrado2);
        const mensajeCifradoHex = bigintConversion.bigintToHex(mensajecifrado2);
        //console.log('mensaje mensajeCifradoHex', mensajeCifradoHex);
        let dataEnviar = { msg: mensajeCifradoHex };
        this.cifrarRSA.enviarMensajeRSA(dataEnviar).subscribe(async (res) => {
          console.log('2 mensaje descifrado con clave privada del servidor desde este :', res);
          Swal.fire('El mensaje descifrado es: '+res['msg'], '', 'success');
        }),
          (err) => {
            console.log('error');
            Swal.fire('Error en la envio del mensaje', '', 'error');
          };
      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida de la clave publica', '', 'error');
      }
    );
  }

        async enviarValidado(): Promise<void> {
          if (this.mensajeVerif === undefined || this.mensajeVerif === '') {
            this.errorMensaje = true;

            return;
          }

          this.errorMensaje = false;
          let clave: RsaPublicKey;
          let clave2: RsaPrivateKey

          this.cifrarRSA.getClave2().subscribe(
            async (res) => {
              //console.log("la clave es ", res);

              //Publica
              this.keyPair2 = new RsaPublicKey(
                bigintConversion.hexToBigint(res.e),
                bigintConversion.hexToBigint(res.n)
              );

              //Privada
               this.keyPair2Priv = new RsaPrivateKey(
                bigintConversion.hexToBigint(res.e),
                bigintConversion.hexToBigint(res.n)
              );


                //cifrar publica
                console.log("***********. Cifrar RSA y AUTH *********** ")

              //console.log('keypair2', this.keyPair2);
              const mensajecifrado2: bigint = await this.keyPair2.encrypt(
                bigintConversion.textToBigint(this.mensajeVerif)
              );
                 console.log(" 1 el mensaje cifrado con clave publica del servidor es",mensajecifrado2 )

                //Hash del mensaje
                 const digest: string = await sha.digest(bigintConversion.bigintToText(mensajecifrado2), 'SHA-512')
                console.log("2 el digest del mensaje encriptado SHA512 es", digest)



                //firmar privada

                const hashcifrado2Priv: bigint = await this.claveRSACliente.privateKey.sign(
                  bigintConversion.textToBigint(digest)
                );

                console.log(' 3 firmar el digest con mi clave privada', hashcifrado2Priv);



              //console.log('mensaje cifrado', mensajecifrado2);

              //console.log('hash cifrado con la priv', hashcifrado2Priv);


              const mensajeCifradoHex = bigintConversion.bigintToHex(mensajecifrado2);

              const hashCifradoHexPriv = bigintConversion.bigintToHex(hashcifrado2Priv);


              //console.log('mensaje mensajeCifradoHex', mensajeCifradoHex);

              //console.log('hash mensajeCifradoHexPriv', hashCifradoHexPriv);


              let dataEnviar = { msg: mensajeCifradoHex , signature: hashCifradoHexPriv, e: await  bigintConversion.bigintToHex(this.claveRSACliente.publicKey.e),
                n: await  bigintConversion.bigintToHex(this.claveRSACliente.publicKey.n)};


              //let dataEnviar = { msg: mensajecifrado2Priv };

              this.cifrarRSA.enviarMensajeRSAHash(dataEnviar).subscribe(async (res) => {
                console.log(' 4 respuesta desde el servidor: mensaje autenticado y  descifrado es:', res);
                Swal.fire('Mensaje autenticado y descifrado es: '+res['msg'], '', 'success');
              }),
                (err) => {
                  console.log('error');
                  Swal.fire('Error en la envio del mensaje', '', 'error');
                };
            },
            (err) => {
              console.log('error');
              Swal.fire('Error en la recogida de la clave publica', '', 'error');
            }
          );
        }


        logout(){
          this.authService.logout();
          this.router.navigateByUrl('/auth');
        }






        async firmaCiega(): Promise<void> {
          if (this.voto === undefined || this.voto === '') {
            this.errorMensaje = true;

            return;
          }

          this.errorMensaje = false;
          console.log("***********. Firma Ciega *********** ")

          this.cifrarRSA.getClave2().subscribe(
            async (res) => {

              const votoCifrado: bigint = await this.claveRSApubServ.encrypt(
                bigintConversion.textToBigint(this.voto)
              );

              console.log('1 mensaje Cifrado con publica del servidor', votoCifrado);

              const votoCifradoCegado: bigint =  await this.cegador.cegar((votoCifrado));

              console.log('2 mensaje Cifrado cegado', votoCifradoCegado);

              const votoCifradoCegadoHex = bigintConversion.bigintToHex(votoCifradoCegado);
              let dataEnviar = { msg: votoCifradoCegadoHex };

              this.cifrarRSA.firmarRSAServ(dataEnviar).subscribe(async (res) => {
                console.log('3 mensaje cifrado y cegado ahora es firmado por el servidor es:', res);



                const mensajeDescegadoFirma: bigint = await this.cegador.descegar(bigintConversion.hexToBigint(res['msg']));

                console.log('4 Descegamos mensaje', votoCifradoCegado);

                let votoCifradoVerificado = this.claveRSApubServ.verify(mensajeDescegadoFirma)

                console.log('5 Verificamos Firma con publica del cliente', votoCifradoVerificado);

              /*   console.log("publicServ", this.claveRSApubServ)
                console.log("voto verificado", votoCifradoVerificado)
                console.log("votocifrado", votoCifrado) */

                if(votoCifrado === votoCifradoVerificado){
                    console.log("6 si el mensaje verificado es el mismo que el voto cifrado, verificado la firma del servidor")

                    const votoCifradoHex = bigintConversion.bigintToHex(votoCifrado);
                    const mensajeDescegadoFirmaHex = bigintConversion.bigintToHex(mensajeDescegadoFirma);

                    let dataEnviarVoto = { voto: votoCifradoHex, firma: mensajeDescegadoFirmaHex };


                    this.cifrarRSA.votarRSA(dataEnviarVoto).subscribe(async (res) => {
                        console.log("7 se manda el mensaje cifrado y el mensaje cifrado firmado  ", res)
                        Swal.fire('Ha votado por '+res['voto'], '', 'success');

                    },
                      (err) => {
                        console.log('error');
                        Swal.fire('Error en el envio del mensaje', '', 'error');
                      }
                    )

                }else{
                  console.log("no, no verificado")
                  Swal.fire('La firma no esta verificada', '', 'error');
                }
              },
                (err) => {
                  console.log(err.status)
                  if (err.status == 404){
                    console.log('Ya ha votado');
                    Swal.fire('Ya has votado, no puedes volver a votar', '', 'error');}
                  else{
                  console.log('error');
                  Swal.fire('Error en la envio del mensaje', '', 'error');
                  }
                });
            },
            (err) => {
              console.log('error');
              Swal.fire('Error en la recogida de la clave publica', '', 'error');
            }
          );
        }


        async secretSharing(): Promise<void> {
          if (this.mensajeCompartido === undefined || this.mensajeCompartido === '') {
            this.errorsecretSharing = true;
            return;
          }
          this.errorsecretSharing = false;
          let dataEnviar = { secret: this.mensajeCompartido, numKeysSecrets: this.keysShared, numkeysThreshold : this.keysThreshold };

           this.cifrarRSA.getSecretSharedKeys(dataEnviar).subscribe(
            async (res) => {
              console.log("secrets Shared keys", res)
              this.sharedSecretsKeys = res;

            },
            (err) => {
              console.log('error');
              Swal.fire('Error en la recogida de la claves Compartidas', '', 'error');
            }
          );
        }



        async RecoverySecret(): Promise<void> {
          this.errorsecretSharing = false;
          let dataEnviar ={keysRecovery: this.keysRecovery }

           this.cifrarRSA.recoverySharedSecret(dataEnviar).subscribe(
            async (res) => {
              console.log("El secreto compartido es", res['recovered'])
              this.secretRecovery = res['recovered'];

            },
            (err) => {
              console.log('error');
              Swal.fire('Error en la recogida de la claves Compartidas', '', 'error');
            }
          );
        }












}

