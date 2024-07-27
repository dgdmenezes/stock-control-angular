import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './../../../services/categories/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetAllCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetAllCategoriesResponse';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesData: Array<GetAllCategoriesResponse> = []
  public selectedCategory: Array<{name:string; code:string}> = []

  public addProductForm = this.formBuilder.group({
    name:["", Validators.required],
    price:["", Validators.required],
    description: ["", Validators.required],
    category_id: ["", Validators.required],
    amount: [0, Validators.required]
  })

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ){}

  ngOnInit(): void {
   this.getAllCategories();

  }

  getAllCategories():void {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) =>{
        if (response.length>0){
          this.categoriesData = response
        }
      }
    })
  }

  handleSubmitAddProduct(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
