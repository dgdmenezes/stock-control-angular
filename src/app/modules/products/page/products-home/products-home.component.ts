import { MessageService } from 'primeng/api';
import { ProductsDataTrasnferService } from './../../../../shared/services/products-data-trasnfer.service';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public productsDatas:Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTrasnferService,
    private router:Router,
    private messageService:MessageService

  ){}

  ngOnInit(): void {
    this.getServicesProductsDatas()
  }

  getServicesProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsData()
    if(productsLoaded.length > 0){
      this.productsDatas = productsLoaded;
    } else this.getAPIProductsDatas()


  }

  getAPIProductsDatas() {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) =>{
        if (response.length>0){
          this.productsDatas = response;
          console.log("dados de produtos", this.productsDatas);
        }
      },
      error:(err) => {
        console.log(err)
        this.messageService.add({
          severity:"error",
          summary:"Erro",
          detail:"Erro ao buscar produtos",
          life:2500,
        })
        this.router.navigate(['/dashboard'])

      }
    })
  }

  handleProductAction(event: EventAction):void{
    if(event){
      console.log("Dados do evento recebido", event);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
