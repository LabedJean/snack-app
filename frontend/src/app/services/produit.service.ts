import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private http : HttpClient) { }

  api = "http://localhost:8080/"

  saveProduit(produits:any){
    return this.http.post(this.api +"produits", produits)
  }

  modifProduit(produitsId:any){
    return this.http.patch(this.api +'produits/'+ produitsId._id, produitsId )
  }

  effacerProduit(produitsId:any){
    return this.http.delete(this.api +'produits/'+ produitsId)
  }

  lesProduits() {
    return this.http.get(this.api+"produits")
  }

}
