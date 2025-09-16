import { afterRenderEffect, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticlesService, Article } from '../articles.service';
import { OrphanCleanerService } from '../orphan-cleaner.service';

type SelectableArticle = Article & { selected: boolean };

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table implements OnInit {
  articles: SelectableArticle[] = [];

  constructor(
    private router: Router,
    private articlesService: ArticlesService,
    private orphanCleanerService: OrphanCleanerService,
  ) { }

  ngOnInit(): void {
    this.articlesService.getArticles().forEach(article => {
      this.articles.push({ ...article, selected: false });
    });
  }

  getRawArticles() { return this.articlesService.getArticles(); }

  getArticleProperties(): (keyof Article)[] {
    return this.articlesService.getArticleProperties();
  }

  onAllCheckBoxesChange(event: any): void {
    const checked = event.target.checked;
    this.articles.forEach(article => (article.selected = checked));
  }

  onCheckboxChange(checkboxId: number, event: any): void {
    const afectedArticle = this.articles.find(article => article.id === checkboxId);
    if (afectedArticle) { afectedArticle.selected = event.target.checked; }
  }

  isAllSelected(): boolean {
    return this.articles.length > 0 && this.articles.every(article => article.selected);
  }

  isNoneSelected(): boolean {
    return this.articles.every(article => !article.selected);
  }

  isOnlyOneSelected(): boolean {
    return this.articles.filter(article => article.selected).length === 1;
  }

  deleteSelectedArticles(): void {
    const articlesToDelete = this.articles.filter(article => article.selected);
    const categoriesToCheck = new Set<string>();
    const afectedIndices: number[] = [];

    articlesToDelete.forEach(article => {
      categoriesToCheck.add(article.category);
      this.articlesService.removeArticle(article.id);
      afectedIndices.push(this.articles.findIndex(eachArticle => eachArticle.id === article.id));
    });

    afectedIndices.reverse().forEach(index => this.articles.splice(index, 1));

    categoriesToCheck.forEach(category => {
      this.orphanCleanerService.removeOrphanCategory(category);
    });
  }

  editSelectedArticle(): void {
    const selected = this.articles.find(article => article.selected);
    if (selected) {
      this.router.navigate(['/form', selected.id]);
    } else { console.error('Ningún artículo selecionado para editar! '); }
  }

  createNewArticle(): void { this.router.navigate(['/form']); }
}
