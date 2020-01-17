import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitEventsService {

  currentRouteId = new Subject<any>();
  dropdownAction = new Subject<any>();
  toggleSidebar = new Subject<any>();

  constructor() { }

  emitCurrentRouteId(data) {
    this.currentRouteId.next(data);
  }

  emitDropdownActions(action) {
    this.dropdownAction.next(action);
  }

  emitToggleSidebar(state) {
    this.toggleSidebar.next(state);
  }

}
