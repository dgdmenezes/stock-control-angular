import { MessageService } from 'primeng/api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTrasnferService } from 'src/app/shared/services/products-data-trasnfer.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  public productsList: Array<GetAllProductsResponse> = []

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDtService:ProductsDataTrasnferService
  ) {}

  ngOnInit(): void {
      this.getProductsDatas();
  }

  getProductsDatas(): void {
    this.productsService
    .getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) =>{
        if (response.length > 0){
          this.productsList = response;
          this.productsDtService.setProductsDatas(this.productsList)

        }
      }, error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao buscar produtos",
          life: 2500,
        })
      }
    })
  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }
}
