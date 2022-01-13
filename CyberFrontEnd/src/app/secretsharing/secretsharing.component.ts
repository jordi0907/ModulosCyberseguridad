import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CifrarService } from '../services/cifrar.service';

@Component({
  selector: 'app-secretsharing',
  templateUrl: './secretsharing.component.html',
  styleUrls: ['./secretsharing.component.css']
})
export class SecretsharingComponent implements OnInit {

  mensajeCompartido;
  keysShared: number;
  keysThreshold: number=0;
  sharedSecretsKeys;
  keysRecovery: string[] = [];
  secretRecovery:any;
  errorSecretRecovery: Boolean = false;
  errorsecretSharing: Boolean = false;

  constructor(   private cifrarRSA: CifrarService,) { }

  ngOnInit(): void {
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
        console.log("*****SECRET SHARING****")
        console.log("1 secrets Shared keys", res)
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
        console.log("2 El secreto compartido es", res['recovered'])
        this.secretRecovery = res['recovered'];

      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida de la claves Compartidas', '', 'error');
      }
    );
  }

}
