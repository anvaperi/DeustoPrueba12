import { Injectable } from '@angular/core';
import { ArticlesService } from './articles.service';
import { CategoriesService } from './categories.service';

@Injectable({
  providedIn: 'root'
})
export class OrphanCleanerService {
  constructor(
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
  ) {}

  removeOrphanCategory(orphanCategory: string): void {
    const remainingArticlesInCat = this.articlesService.getArticles().some(
      article => article.category === orphanCategory
    );
    if (!remainingArticlesInCat) {
      console.log(`Del ${orphanCategory}! `);
      this.categoriesService.removeCategory(orphanCategory);
    }
  }
}
