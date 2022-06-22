import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  api = "http://localhost:8080/"

  // saveUtilisateur(produits:any){
  //   return this.http.post(this.api +"produits", produits)
  // }
  //déja dans login ?

  modifUtilisateur(utilisateur:any){
    return this.http.patch(this.api +'user/'+ utilisateur._id, utilisateur )
  }

  effacerUtilisateur(utilisateurId:any){
    return this.http.delete(this.api +'user/'+ utilisateurId)
  }

  utilisateurs() {
    return this.http.get(this.api+"user")
  }

}
