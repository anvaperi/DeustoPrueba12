import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ArticlesService } from '../articles.service';
import { CategoriesService } from '../categories.service';
import { OrphanCleanerService } from '../orphan-cleaner.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {
  previousCategory: string | null = null;
  newArticleForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private newArticleFormBuilder: FormBuilder,
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
    private orphanCleanerService: OrphanCleanerService,
  ) { }


  ngOnInit(): void {
    this.newArticleForm = this.newArticleFormBuilder.group({
      id: [this.getLowestAvailableId(), Validators.required],
      name: ['', Validators.required],
      portionQuantity: [1, Validators.required],
      portionUnit: ['g', Validators.required],
      category: [null, Validators.required],
      stockUnits: [0],
      temperature_Celsius: [0],
      preparation_min: [0],
      vegan_friendly: [false],
      underage_friendly: [false],
      celiac_friendly: [false],
      price_euros_cents: [0]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const article = this.articlesService.getArticles().find(article => article.id === +id);
      if (article) { this.newArticleForm.patchValue(article); }
    }

    this.newArticleForm.get('category')?.valueChanges.subscribe(newCategory => {
      if (this.previousCategory) {
        this.orphanCleanerService.removeOrphanCategory(this.previousCategory);
      }
      this.previousCategory = newCategory;
    });
  }

  getCategories(): string[] {
    return this.categoriesService.getCategories()
  }

  getLowestAvailableId(): number {
    const ids: Array<number> = this.articlesService.getArticles().map(article => article.id).sort((a, b) => a - b);
    const idslen: number = ids.length;
    let idcursor = 0;
    while (idcursor < idslen && idcursor === ids[idcursor]) { idcursor++; }
    return idcursor;
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'Nueva Categoría') {
      const newCat = prompt('Introduce el nombre de la nueva categoría:');
      if (!newCat) {
        this.newArticleForm.patchValue({ category: null });
        return;
      }
      if (!this.categoriesService.categories.includes(newCat)) {
        this.categoriesService.addCategory(newCat);
      }
      this.newArticleForm.patchValue({ category: newCat });
    }
  }

  onSubmit() {
    this.articlesService.articles.push(this.newArticleForm.value);
    console.log(this.newArticleForm.value);
  }
}
