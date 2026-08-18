import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { PROFILE } from '../../data/profile.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();
}
