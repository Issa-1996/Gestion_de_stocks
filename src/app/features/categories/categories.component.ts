import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/product.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Catégories</h1>
        <button class="btn-primary" (click)="openAddModal()">+ Nouvelle Catégorie</button>
      </div>

      <div class="categories-grid">
        @for (category of categories(); track category.id) {
          <div class="category-card">
            <div class="category-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm0 9h7v7h-7v-7zm-9 0h7v7H4v-7z"/>
              </svg>
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
        }
      </div>

      <app-modal [isOpen]="showModal()" [title]="'Nouvelle Catégorie'" (close)="closeModal()">
        <form (ngSubmit)="onSubmit()" class="category-form">
          <div class="form-group">
            <label>Nom de la catégorie *</label>
            <input type="text" [(ngModel)]="newCategory.name" name="name" required>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="newCategory.description" name="description" rows="3"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn-primary">Ajouter la catégorie</button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a202c; margin: 0; }
    .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
    .btn-secondary { padding: 12px 24px; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: #f7fafc; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px; }
    .category-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; transition: transform 0.2s; }
    .category-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .category-icon { width: 64px; height: 64px; margin: 0 auto 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; }
    .category-card h3 { font-size: 18px; font-weight: 600; color: #1a202c; margin: 0 0 8px 0; }
    .category-card p { font-size: 14px; color: #718096; margin: 0; }
    
    .category-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-weight: 600; color: #2d3748; font-size: 14px; }
    .form-group input, .form-group textarea { padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; transition: all 0.2s; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  showModal = signal(false);
  
  newCategory: any = {
    name: '',
    description: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  openAddModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.newCategory = {
      name: '',
      description: ''
    };
  }

  onSubmit(): void {
    const category = {
      ...this.newCategory,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.categories.update(cats => [...cats, category]);
    this.closeModal();
    alert('Catégorie ajoutée avec succès !');
  }
}
