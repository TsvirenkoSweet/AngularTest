import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { map } from 'rxjs/operators';
import { ImageService } from './services/image.service';

export interface Picture {
  id: string;
  cropped_picture: string;
  imageDetail: Array<PictureDetail>;
}

export interface PictureDetail {
  author: string;
  camera: string;
  cropped_picture: string;
  full_picture: string;
  id: string;
  tags: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public isLogin: boolean;
  public firstUpload = false;
  public pageNumber: number;
  public imgArr: Array<Picture> = [];
  public showSlider = false;
  public openedCurImgId: string;
  public openedCurIndex: number;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.authService.accessToken.subscribe((token) => {
      if (token) {
        this.isLogin = !!token;
      }
    });
  }

  public getImages(): void {
    this.imageService.getImages().subscribe((res) => {
      this.imgArr = res.pictures;
      this.firstUpload = true;
      this.pageNumber = 1;
    });
  }

  public showMoreImages(page: number): void {
    this.imageService.showMoreImages(page)
      .pipe(
        map((imgObg) => imgObg.pictures),
      )
      .subscribe((res) => {
        if (res.length) {
          this.imgArr = [ ...this.imgArr, ...res ];
          this.firstUpload = true;
          this.pageNumber = page;
        }
      });
  }

  public singIn(): void {
    this.authService.singIn();
  }

  public slideImage(index: number): void {
    this.openImage(this.imgArr[index].id, index);
  }

  public openImage(id: string, index: number): void {
    this.imageService.getImageDetail(id, index, this.imgArr)
      .subscribe((images: Array<PictureDetail>) => {
        if (images.length) {
          this.showSlider = true;
          this.openedCurImgId = images[0].id;
          this.openedCurIndex = index;
        }
      });
  }
}
