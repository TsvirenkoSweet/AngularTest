import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Picture } from '../app.component';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit{

  @Input() public imgArr: Array<Picture> = [];
  @Input() public openedCurImgId: string;
  @Input() public openedCurIndex: number;
  @Output() public showSlide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public slideEvent: EventEmitter<number> = new EventEmitter<number>();
  public currentImgIndex: number;

  constructor() { }

  public ngOnInit(): void {
    this.currentImgIndex = this.openedCurIndex;
  }

  public closeSlider(flag: boolean): void {
    this.showSlide.emit(flag);
  }

  public slideImage(imgIndex: number): void {
    this.currentImgIndex = imgIndex;
    this.slideEvent.emit(this.currentImgIndex);
  }
}
