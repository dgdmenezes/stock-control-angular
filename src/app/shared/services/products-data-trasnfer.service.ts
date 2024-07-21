import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTrasnferService {

  //quando a propriedade retorna um observable conveciona-se colocar o simbolo $ no final
  public productsDataEmiter$ =
    new BehaviorSubject<Array <GetAllProductsResponse> | null> (null)

  public productsData: Array<GetAllProductsResponse> = [];

  setProductsDatas(products: Array<GetAllProductsResponse>): void{
    if (products){
      this.productsDataEmiter$.next(products)
      this.getProductsData()
    }
  }
  getProductsData() {
    this.productsDataEmiter$
    .pipe(
      take(1),
     map( (data) => data?.filter( (product) => product.amount >0 ))
    )
    .subscribe({
      next: (response) =>{
        if (response){
          this.productsData = response
        }
      }
    })
    return this.productsData
  }

}
