import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from './modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  private element: any;
  datas: { label: string; value: string }[] = [];

  save$ = new BehaviorSubject<{ label: string; value: string }[]>(undefined);

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el) => {
      if (el.target.className === 'jw-modal') {
        console.log('close');
        this.datas = [];
        this.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    console.log('on destroy');
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(datas: { label: string; value: string }[]): void {
    this.datas = datas;
    this.element.style.display = 'block';
    document.body.classList.add('jw-modal-open');
  }

  // close modal
  close(): void {
    this.datas = [];
    this.element.style.display = 'none';
    document.body.classList.remove('jw-modal-open');
  }

  save() {
    this.save$.next(this.datas);
    this.close();
  }
}
