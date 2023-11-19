import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  refreshAppSubject = new Subject<string>();
  constructor() { }
}
