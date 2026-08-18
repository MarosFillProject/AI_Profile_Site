import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface DigitalTwinMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DigitalTwinResponse {
  reply: string;
  model: string;
}

@Injectable({ providedIn: 'root' })
export class DigitalTwinChatService {
  private readonly http = inject(HttpClient);

  send(messages: DigitalTwinMessage[]): Observable<DigitalTwinResponse> {
    return this.http.post<DigitalTwinResponse>('/api/digital-twin-chat', { messages });
  }
}
