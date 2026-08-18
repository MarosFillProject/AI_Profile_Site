import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { PROFILE } from '../../data/profile.data';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly profile = PROFILE;
}
