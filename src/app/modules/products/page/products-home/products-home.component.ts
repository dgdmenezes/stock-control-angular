import { MessageService, ConfirmationService } from 'primeng/api';
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
    private messageService:MessageService,
    private confirmationService: ConfirmationService

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

  handleDeleteProductAction(event:{
    product_id:string,
    productName:string
  }): void{
    if(event){
      this.confirmationService.confirm({
        message:`Confirma a exclusão do produto: ${event?.productName}`,
        header:"Confirmação de exclusão",
        icon: "pi pi-exclamation-triangle",
        acceptLabel:"Sim",
        rejectLabel:"Não",
        accept: () => this.deleteProduct(event?.product_id)
      })
    }
  }
  deleteProduct(product_id: string) {
    if(product_id){
      this.productsService.deleteProduct(product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) =>{
          if(response){
            this.messageService.add({
              severity:"success",
              summary:"Sucesso",
              detail: "Produto Removido com sucesso",
              life: 2500,
            })

            this.getAPIProductsDatas(); //fazer novo render na tabela de produtos
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity:"error",
            summary:"Erro",
            detail: "Erro ao remover produto!",
            life: 2500,
          })
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
