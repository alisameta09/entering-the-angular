import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'infinite-scroll-trigger',
  imports: [],
  templateUrl: './infinite-scroll-trigger.component.html',
  styleUrl: './infinite-scroll-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollTriggerComponent implements OnInit {
  @Output() loaded = new EventEmitter<void>();

  ngOnInit() {
    this.loaded.emit()
  }
}
