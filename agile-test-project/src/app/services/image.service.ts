import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { Picture, PictureDetail } from '../app.component';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private apiService: ApiService) {}

  public getImages(): Observable<any> {
    return this.apiService.getApi('http://interview.agileengine.com/images');
  }

  public showMoreImages(page: number): Observable<any> {
    return this.apiService.getApi(`http://interview.agileengine.com/images?page=${page}`);
  }
  public getImageDetail(id: string, index: number, imgArr: Array<Picture>): Observable<Array<PictureDetail> | null> {
    const nextId = index + 1 <= imgArr.length - 1 ? imgArr[index + 1].id : false;
    const prevId = index - 1 >= 0 ? imgArr[index - 1].id : false;

    return this.prepareRequest(id, index, prevId, nextId, imgArr);
  }

  private prepareRequest(
    id: string,
    index: number,
    prevId: string | boolean,
    nextId: string | boolean,
    imgArr: Array<Picture>
  ): Observable<Array<PictureDetail> | null> {
    const prevRequest: boolean = !!prevId;
    const nexRequest: boolean = !!nextId;

    if (prevRequest && nexRequest) {
      return this.getPrevCurNextImagesDetails(id, index, prevId, nextId, imgArr);
    }

    if (prevRequest && !nexRequest) {
      return this.getCurrentAndPrevImageDetails(id, index, prevId, imgArr);
    }

    if (!prevRequest && nexRequest) {
      return this.getCurrentAndNextImageDetails(id, index, nextId, imgArr);
    }

    return EMPTY;
  }


  private getPrevCurNextImagesDetails(
    id: string,
    index: number,
    prevId: string | boolean,
    nextId: string | boolean,
    imgArr: Array<Picture>
  ): Observable<Array<PictureDetail>> {
    return forkJoin([
      this.getCurImageDetail(id, index, imgArr),
      this.getPrevImageDetail(prevId, index, imgArr),
      this.getNextImageDetail(nextId, index, imgArr)
    ]);
  }

  private getCurrentAndPrevImageDetails(
    id: string,
    index: number,
    prevId: string | boolean,
    imgArr: Array<Picture>
  ): Observable<Array<PictureDetail>> {
    return forkJoin([
      this.getCurImageDetail(id, index, imgArr),
      this.getPrevImageDetail(prevId, index, imgArr)
    ]);
  }

  private getCurrentAndNextImageDetails(
    id: string,
    index: number,
    nextId: string | boolean,
    imgArr: Array<Picture>
  ): Observable<Array<PictureDetail>> {
    return forkJoin([
      this.getCurImageDetail(id, index, imgArr),
      this.getNextImageDetail(nextId, index, imgArr)
    ]);
  }

  private getPrevImageDetail(
    prevId: string | boolean,
    index: number,
    imgArr: Array<Picture>
  ): Observable<PictureDetail> {
    if (!imgArr[index - 1].imageDetail) {
      return this.apiService.getApi(`http://interview.agileengine.com/images/${prevId}`)
        .pipe(
          tap(prevImg => {
            imgArr[index - 1].imageDetail = [prevImg];
            return prevImg;
          })
        );
    }

    return this.returnStreamObject(imgArr[index - 1].imageDetail[0]);
  }

  private getCurImageDetail(id: string, index: number, imgArr: Array<Picture>): Observable<PictureDetail> {
    if (!imgArr[index].imageDetail) {
      return this.apiService.getApi(`http://interview.agileengine.com/images/${id}`)
        .pipe(
          tap(currentImg => {
            imgArr[index].imageDetail = [currentImg];
            return currentImg;
          })
        );
    }

    return this.returnStreamObject(imgArr[index].imageDetail[0]);
  }

  private getNextImageDetail(
    nextId: string | boolean,
    index: number,
    imgArr: Array<Picture>
  ): Observable<PictureDetail> {
    if (!imgArr[index + 1].imageDetail) {
      return this.apiService.getApi(`http://interview.agileengine.com/images/${nextId}`)
        .pipe(
          tap(nextImg => {
            imgArr[index + 1].imageDetail = [nextImg];
            return nextImg;
          })
        );
    }

    return this.returnStreamObject(imgArr[index + 1].imageDetail[0]);
  }

  private returnStreamObject(obj: PictureDetail): Observable<PictureDetail> {
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
