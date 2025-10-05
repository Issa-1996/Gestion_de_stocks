import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Rapports</h1>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <div class="report-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
            </svg>
          </div>
          <h3>Rapport de Ventes</h3>
          <p>Analyse détaillée des ventes par période</p>
          <button class="btn-secondary">Générer</button>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"/>
            </svg>
          </div>
          <h3>Rapport d'Inventaire</h3>
          <p>État actuel des stocks et mouvements</p>
          <button class="btn-secondary">Générer</button>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h3>Rapport Financier</h3>
          <p>Revenus, dépenses et bénéfices</p>
          <button class="btn-secondary">Générer</button>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Rapport Fournisseurs</h3>
          <p>Performance et historique des fournisseurs</p>
          <button class="btn-secondary">Générer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a202c; margin: 0; }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .report-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; transition: transform 0.2s; }
    .report-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .report-icon { width: 64px; height: 64px; margin: 0 auto 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; }
    .report-card h3 { font-size: 18px; font-weight: 600; color: #1a202c; margin: 0 0 8px 0; }
    .report-card p { font-size: 14px; color: #718096; margin: 0 0 16px 0; }
    .btn-secondary { padding: 10px 20px; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: #667eea; color: white; }
  `]
})
export class ReportsComponent {}
