import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  DigitalTwinChatService,
  DigitalTwinMessage,
} from '../../services/digital-twin-chat.service';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-digital-twin-chat',
  standalone: true,
  imports: [FormsModule, RevealDirective],
  templateUrl: './digital-twin-chat.component.html',
  styleUrl: './digital-twin-chat.component.scss',
})
export class DigitalTwinChatComponent {
  @ViewChild('conversation') private readonly conversation?: ElementRef<HTMLDivElement>;

  readonly messages = signal<DigitalTwinMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi, I'm Maros's Digital Twin. Ask me about his engineering background, education, projects, or where he fits best.",
    },
  ]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly prompts = [
    'What kind of roles is Maros strongest for?',
    'Summarize his front-end leadership experience.',
    'How does his PhD connect to engineering work?',
  ];

  draft = '';

  private readonly chat = inject(DigitalTwinChatService);

  send(message = this.draft): void {
    const content = message.trim();

    if (!content || this.loading()) {
      return;
    }

    const nextMessages = [...this.messages(), { role: 'user' as const, content }];
    this.messages.set(nextMessages);
    this.draft = '';
    this.error.set('');
    this.loading.set(true);
    this.scrollToLatest();

    this.chat
      .send(nextMessages)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ reply }) => {
          this.messages.set([...nextMessages, { role: 'assistant', content: reply }]);
          this.scrollToLatest();
        },
        error: (err) => {
          const fallback =
            err?.error?.error ||
            'The Digital Twin is unavailable right now. Please try again in a moment.';
          this.error.set(fallback);
          this.scrollToLatest();
        },
      });
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.shiftKey) {
      return;
    }

    keyboardEvent.preventDefault();
    this.send();
  }

  private scrollToLatest(): void {
    setTimeout(() => {
      const element = this.conversation?.nativeElement;

      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
