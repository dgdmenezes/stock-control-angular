import { MessageService } from 'primeng/api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTrasnferService } from 'src/app/shared/services/products-data-trasnfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();

  public productsList: Array<GetAllProductsResponse> = []

  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

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
          this.setProductsChartConfig();

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

  setProductsChartConfig(): void {
    if (this.productsList.length > 0){
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')
    const textColorSeconday = documentStyle.getPropertyValue('--text-color-secondary')
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

    this.productsChartDatas ={
      labels: this.productsList.map( (element) => element?.name),
      datasets:[
        {
          label:"Quantidade",
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.productsList.map( (element) => element?.amount)
        }
      ]
    }

        this.productsChartOptions ={
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins:{
            legend:{
              labels:{
                color:textColor
              }
            }
          },

          scales:{
            x:{
              ticks:{
                color:textColorSeconday,
                font:{
                  weight:'bolder'
                },
              },
              grid:{
                color: surfaceBorder
              }
            },
            y:{
              ticks:{
                color:textColorSeconday,
              },
              grid:{
                color: surfaceBorder
              },
            }
          }
        }
      }
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

  }





