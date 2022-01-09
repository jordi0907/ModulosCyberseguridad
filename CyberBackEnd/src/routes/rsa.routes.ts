import { Router } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { getPublicKeyRSA,descifrarRSA,cifrarRSA,signRSA, votarRSA, signIn, registrar, recuento, descifrarRSAHash, getSecretSharedKeys, recoverySharedSecret, getPaillierKeys, getRecuentoVotosHomomorfico} from '../controller/rsa.controller';
import passport from "passport";


const router = Router();


router.get('/clave', getPublicKeyRSA);
router.post('/mensajeD', descifrarRSA);
router.post('/mensajeC', cifrarRSA);
router.post('/signServer',  signRSA);
router.post('/votarServ', votarRSA);
router.post('/signIn', signIn);
//router.post('/registrar', registrar);
router.post('/registrar', registrar);
router.get('/recuento', recuento);
router.post('/mensajeDHash', descifrarRSAHash);
router.post('/getSecretSharedKeys', getSecretSharedKeys);
router.post('/recoverySharedSecret', recoverySharedSecret);
router.get('/getPaillierKeys', getPaillierKeys);
router.post('/getRecuentoVotosHomomorfico', getRecuentoVotosHomomorfico);


//router.get('/clave', getPublica);



export default router;