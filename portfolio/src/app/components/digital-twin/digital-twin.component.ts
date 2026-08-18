import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-digital-twin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digital-twin.component.html',
  styleUrl: './digital-twin.component.scss',
})
export class DigitalTwinComponent {
  readonly quickPrompts = [
    'What were your main roles across your career?',
    'Which technologies did you work with most?',
    'Tell me about your education and PhD work.',
    'What did you do at Celonis and Michelin?',
  ];

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content:
        'Hi, I am Maroš’s digital twin. Ask me about his software engineering career, education, or key projects.',
    },
  ];

  draft = '';
  isLoading = false;

  async sendMessage(): Promise<void> {
    const message = this.draft.trim();

    if (!message || this.isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: message };
    this.messages = [...this.messages, userMessage];
    this.draft = '';
    this.isLoading = true;

    try {
      const response = await fetch('/api/digital-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: this.messages.slice(0, -1),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to get a response right now.');
      }

      this.messages = [
        ...this.messages,
        {
          role: 'assistant',
          content: data.reply ?? 'I am not sure how to answer that based on Maroš’s profile right now.',
        },
      ];
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Something went wrong while contacting the digital twin.';

      this.messages = [
        ...this.messages,
        {
          role: 'assistant',
          content: `I’m having trouble answering that right now. ${messageText}`,
        },
      ];
    } finally {
      this.isLoading = false;
    }
  }

  askQuickPrompt(prompt: string): void {
    this.draft = prompt;
    void this.sendMessage();
  }
}
