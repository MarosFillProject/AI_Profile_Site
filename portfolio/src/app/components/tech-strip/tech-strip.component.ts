import { Component } from '@angular/core';

@Component({
  selector: 'app-tech-strip',
  standalone: true,
  templateUrl: './tech-strip.component.html',
  styleUrl: './tech-strip.component.scss',
})
export class TechStripComponent {
  readonly items = [
    'Angular',
    'Vue.js',
    'TypeScript',
    'Node.js',
    'GraphQL',
    'PostgreSQL',
    'Cypress',
    'Storybook',
    'Figma',
    'Tailwind',
    'Azure DevOps',
    'UI/UX',
  ];
}
