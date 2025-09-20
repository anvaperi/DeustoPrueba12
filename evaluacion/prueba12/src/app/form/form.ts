import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ArticlesService, Article } from '../articles.service';
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
  priceDisplayValue: string = '0,00';

  constructor(
    private route: ActivatedRoute,
    private newArticleFormBuilder: FormBuilder,
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
    private orphanCleanerService: OrphanCleanerService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.newArticleForm = this.newArticleFormBuilder.group({
      id: [this.getLowestAvailableId(), [Validators.required, Validators.min(0)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      portionQuantity: [0, [Validators.required, Validators.min(0)]],
      portionUnit: ['g', Validators.required],
      category: [null, Validators.required],
      stockUnits: [0, [Validators.required, Validators.min(0)]],
      temperature_Celsius: [0, [Validators.required, Validators.min(-273)]],
      preparation_min: [0, [Validators.required, Validators.min(0)]],
      vegan_friendly: [false],
      underage_friendly: [false],
      celiac_friendly: [false],
      price_euros_cents: [0, [Validators.required, Validators.min(0)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const article = this.articlesService.getArticles().find(article => article.id === +id);
      if (article) {
        this.newArticleForm.patchValue(article);
        this.priceDisplayValue = (article.price_euros_cents / 100).toFixed(2).replace('.', ',');
      }
    }

    this.newArticleForm.get('category')?.valueChanges.subscribe(newCategory => {
      if (this.previousCategory) {
        this.orphanCleanerService.removeOrphanCategory(this.previousCategory);
      }
      this.previousCategory = newCategory;
    });
  }

  toggleSelection() {
    const current = this.newArticleForm.get('portionUnit')?.value;
    this.newArticleForm.get('portionUnit')?.setValue(current === 'g' ? 'ml' : 'g');
  }

  onPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    input.value = (Number(value)/100).toString();

    if (value === '') {
      this.priceDisplayValue = '0,00';
      this.newArticleForm.get('price_euros_cents')?.patchValue(0);
    } else {
      let cents = parseInt(value, 10);
      let euros = cents / 100;
      this.priceDisplayValue = euros.toFixed(2).replace('.', ',');
      this.newArticleForm.get('price_euros_cents')?.patchValue(cents);
    }
  }

  get id() { return this.newArticleForm.get('id'); }
  get name() { return this.newArticleForm.get('name'); }
  get portionQuantity() { return this.newArticleForm.get('portionQuantity'); }
  get portionUnit() { return this.newArticleForm.get('portionUnit'); }
  get category() { return this.newArticleForm.get('category'); }
  get stockUnits() { return this.newArticleForm.get('stockUnits'); }
  get temperature_Celsius() { return this.newArticleForm.get('temperature_Celsius'); }
  get preparation_min() { return this.newArticleForm.get('preparation_min'); }
  get vegan_friendly() { return this.newArticleForm.get('vegan_friendly'); }
  get underage_friendly() { return this.newArticleForm.get('underage_friendly'); }
  get celiac_friendly() { return this.newArticleForm.get('celiac_friendly'); }
  get price_euros_cents() { return this.newArticleForm.get('price_euros_cents'); }

  getCategories(): string[] { return this.categoriesService.getCategories(); }

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
    if (this.newArticleForm.valid) {
      const newArticle: Article = this.newArticleForm.value as Article;
      this.articlesService.setArticle(newArticle);
      this.router.navigate(['/table']);
    } else {
      console.log('El formulario no es válido. No se puede guardar.');
    }
  }
}
