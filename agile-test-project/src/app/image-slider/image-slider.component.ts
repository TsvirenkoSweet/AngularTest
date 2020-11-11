import {Component, Input, Output, EventEmitter, ViewChild, OnInit} from '@angular/core';
import {Picture} from "../app.component";

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit{

  @Input() imgArr: Array<Picture> = [];
  @Input() openedCurImgId: string;
  @Input() openedCurIndex: number;
  @Output() showSlide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() slideEvent: EventEmitter<number> = new EventEmitter<number>();
  currentImgIndex: number;

  constructor() { }

  ngOnInit(): void {
    this.currentImgIndex = this.openedCurIndex;
  }

  closeSlider(flag: boolean) {
    this.showSlide.emit(flag);
  }

  slideImage(imgIndex: number) {
    this.currentImgIndex = imgIndex;
    this.slideEvent.emit(this.currentImgIndex);
  }

}
