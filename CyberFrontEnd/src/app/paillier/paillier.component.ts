import { Component, OnInit } from '@angular/core';
import { CifrarService } from '../services/cifrar.service';
import Swal from 'sweetalert2';
import * as paillierBigint from 'paillier-bigint'
import * as bigintConversion from 'bigint-conversion';

@Component({
  selector: 'app-paillier',
  templateUrl: './paillier.component.html',
  styleUrls: ['./paillier.component.css']
})
export class PaillierComponent implements OnInit {

  votoPartido1 = 0;
  votoPartido2 = 0;
  votoPartido3 = 0;
  publicKeyPaillier;
  votosTotales =[];
  totalResultados;

  constructor(private cifrarRSA: CifrarService) { }

  ngOnInit(): void {
    this.cifrarRSA.getPaillierKeys().subscribe(
      async (res) => {
        console.log("LAs claves Paillier son", res['n'], res['g'])
        this.publicKeyPaillier = new paillierBigint.PublicKey(bigintConversion.hexToBigint(res['n']), bigintConversion.hexToBigint(res['g']))
        console.log("LA clave Publica Paillier es: ", this.publicKeyPaillier)
      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida de la claves Compartidas', '', 'error');
      }
    );
  }
  async voto1(): Promise<void> {
    this.votoPartido1++;
    let voto1: bigint;
    voto1=10000n;
    const voto1Encryptado = await this.publicKeyPaillier.encrypt(voto1);
    this.votosTotales.push(voto1Encryptado);
    console.log("votos encryptados", this.votosTotales)
  }


  async voto2(): Promise<void> {
    this.votoPartido2++;
    let voto2: bigint;
    voto2=100n;
    const voto1Encryptado = await this.publicKeyPaillier.encrypt(voto2);
    this.votosTotales.push(voto1Encryptado);
    console.log("votos encryptados", this.votosTotales)
  }

  async voto3(): Promise<void> {
    this.votoPartido3++;
    let voto3: bigint;
    voto3=1n;
    const voto1Encryptado = await this.publicKeyPaillier.encrypt(voto3);
    this.votosTotales.push(voto1Encryptado);
    console.log("votos encryptados", this.votosTotales)
  }

  async getRecuentoVotos(): Promise<void> {
    let votosTotalesAddition = BigInt(1);
    console.log("votosTotales",this.votosTotales )
    for (let i in this.votosTotales)
    {votosTotalesAddition = await this.publicKeyPaillier.addition(this.votosTotales[i],votosTotalesAddition )
    }
    console.log( "total de votos encryptados", votosTotalesAddition)

    let dataEnviar = { votos: bigintConversion.bigintToHex(votosTotalesAddition)  };
    this.cifrarRSA.getRecuentoVotosHomomorfico(dataEnviar).subscribe(
      async (res) => {
      console.log(res)
      this.totalResultados =  bigintConversion.hexToBigint(res['recuento'])
      console.log("total de resultados ", this.totalResultados)
      //const votos = ("0000"+this.totalResultados).slice(-5)
      //console.log("total votos", votos)
      const digits = this.totalResultados.toString()
      if(digits.length==6){
      console.log( "votos partido 1 ", digits.substr(0,2))
      console.log( "votos partido 2 ", digits.substr(2,2))
      console.log( "votos partido 3 ", digits.substr(4,2))
      }else{
        console.log( "votos partido 1 ", digits.substr(0,1))
        console.log( "votos partido 2 ", digits.substr(1,2))
        console.log( "votos partido 3 ", digits.substr(3,2))
      }
      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida de la claves Compartidas', '', 'error');
      }
    );
  }




}
