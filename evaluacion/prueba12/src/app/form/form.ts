import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {
  categories: Array<string> = [];
  previousCategory: string | null = null;
  newArticleForm!: FormGroup;

  constructor(
    private newArticleFormBuilder: FormBuilder,
    private articlesService: ArticlesService,
  ) { }


  ngOnInit(): void {
    this.categories = this.articlesService.getCategories();

    this.newArticleForm = this.newArticleFormBuilder.group({
      id: [this.getNextAvailableId()],
      name: ['', Validators.required],
      portionQuantity: [1, Validators.required],
      portionUnit: ['ml'],
      category: [null],
      stockUnits: [0],
      temperature_Celsius: [0],
      preparation_min: [0],
      vegan_friendly: [false],
      underage_friendly: [false],
      celiac_friendly: [false],
      price_euros_cents: [0]
    });

    this.newArticleForm.get('category')?.valueChanges.subscribe(newCategory => {
      if (this.previousCategory) {
        this.articlesService.removeOrphanCategory(this.previousCategory);
      }
      this.previousCategory = newCategory;
    });
  }

  getNextAvailableId(): number {
    const ids: Array<number> = this.articlesService.getArticles().map(article => article.id).sort((a, b) => a - b);
    const idslen: number = ids.length;
    let idcursor = 0;
    while (idcursor < idslen && idcursor === ids[idcursor]) { idcursor++; }
    return idcursor;
  }

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'Nueva Categoría') {
      const newCat = prompt('Introduce el nombre de la nueva categoría:');
      if (!newCat) {
        this.newArticleForm.patchValue({ category: null });
        return;
      }
      if (this.categories.includes(newCat)) {
        this.newArticleForm.patchValue({ category: newCat });
        return;
      }
      this.articlesService.addCategory(newCat);
      this.categories = this.articlesService.getCategories();
      this.newArticleForm.patchValue({ category: newCat });

    }
  }

  onSubmit(){
    this.articlesService.articles.push(this.newArticleForm.value);
    console.log(this.newArticleForm.value);
  }
}
