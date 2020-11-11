import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {ApiService} from "./services/api.service";
import {map, tap} from "rxjs/operators";
import {forkJoin, Observable, of} from "rxjs";

export interface Picture {
  id: string,
  cropped_picture: string,
  imageDetail: Array<PictureDetail>
}

export interface PictureDetail {
  author: string,
  camera: string,
  cropped_picture: string,
  full_picture: string,
  id: string,
  tags: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public isLogin: boolean;
  public firstUpload: boolean = false;
  public pageNumber: number;
  public imgArr: Array<Picture> = [];
  public showSlider: boolean = false;
  public openedCurImgId: string;
  public openedCurIndex: number;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.accessToken.subscribe((token) => {
      if (token) {
        this.isLogin = !!token;
      }
    });
  }

  getImages() {
    this.apiService.getApi('http://interview.agileengine.com/images').subscribe((res) => {
      this.imgArr = res.pictures;
      this.firstUpload = true;
      this.pageNumber = 1;
    })
  }

  showMoreImages(page: number) {
    this.apiService.getApi(`http://interview.agileengine.com/images?page=${page}`)
      .pipe(
        map((imgObg) => imgObg.pictures),
      )
      .subscribe((res) => {
        if (res.length) {
          this.imgArr = [ ...this.imgArr, ...res ];
          this.firstUpload = true;
          this.pageNumber = page;
        }
    })
  }

  singIn() {
    this.authService.singIn();
  }

  slideImage(index: number) {
    this.openImage(this.imgArr[index].id, index);
  }

  openImage(id: string, index: number) {
    this.getImageDetail(id, index)
      .subscribe((images: Array<PictureDetail>) => {
        if (images.length) {
          this.showSlider = true;
          this.openedCurImgId = images[0].id;
          this.openedCurIndex = index;
        }
      })
  }

  private getImageDetail(id: string, index: number) {
    const nextId = index + 1 <= this.imgArr.length - 1 ? this.imgArr[index + 1].id : false;
    const prevId = index - 1 >= 0 ? this.imgArr[index - 1].id : false;

    return this.prepareRequst(id, index, prevId, nextId);
  }

  private prepareRequst(id: string, index: number, prevId: string | boolean, nextId: string | boolean) {
    const prevRequest: boolean = !!prevId;
    const nexRequest: boolean = !!nextId;

    if (prevRequest && nexRequest) {
      return this.getPrevCurNextImagesDetails(id, index, prevId, nextId);
    }

    if (prevRequest && !nexRequest) {
      return this.getCurrentAndPrevImageDetails(id, index, prevId);
    }

    if (!prevRequest && nexRequest) {
      return this.getCurrentAndNextImageDetails(id, index, nextId);
    }

    return new Observable();
  }


  private getPrevCurNextImagesDetails(id, index, prevId, nextId) {
    return forkJoin([
      this.getCurImageDetail(id, index),
      this.getPrevImageDetail(prevId, index),
      this.getNextImageDetail(nextId, index)
    ])
  }

  private getCurrentAndPrevImageDetails(id, index, prevId) {
    return forkJoin([
      this.getCurImageDetail(id, index),
      this.getPrevImageDetail(prevId, index)
    ])
  }

  private getCurrentAndNextImageDetails(id, index, nextId) {
    return forkJoin([
      this.getCurImageDetail(id, index),
      this.getNextImageDetail(nextId, index)
    ])
  }

  private getPrevImageDetail(prevId, index) {
    if (!this.imgArr[index - 1].imageDetail) {
      return this.apiService.getApi(`http://interview.agileengine.com/images/${prevId}`)
        .pipe(
          tap(prevImg => {
              this.imgArr[index - 1].imageDetail = [prevImg];
              return prevImg;
          })
        )
    }

    return this.returnStreamObject(this.imgArr[index - 1].imageDetail[0]);
  }

  private getCurImageDetail(id, index) {
    if (!this.imgArr[index].imageDetail) {
      return this.apiService.getApi(`http://interview.agileengine.com/images/${id}`)
        .pipe(
          tap(currentImg => {
              this.imgArr[index].imageDetail = [currentImg];
              return currentImg;
          })
        )
    }

    return this.returnStreamObject(this.imgArr[index].imageDetail[0]);
  }

  private getNextImageDetail(nextId, index) {
    if (!this.imgArr[index + 1].imageDetail) {
      return this.apiService.getApi(`http://interview.agileengine.com/images/${nextId}`)
        .pipe(
          tap(nextImg => {
              this.imgArr[index + 1].imageDetail = [nextImg];
              return nextImg;
          })
        )
    }

    return this.returnStreamObject(this.imgArr[index + 1].imageDetail[0]);
  }

  private returnStreamObject(obj) {
    const thisImg: PictureDetail = obj;
    const imgInfo: PictureDetail = {
      author: thisImg.author,
      camera: thisImg.camera,
      cropped_picture: thisImg.cropped_picture,
      full_picture: thisImg.full_picture,
      id: thisImg.id,
      tags: thisImg.tags
    };

    return of(imgInfo);
  }
}
