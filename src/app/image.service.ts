import { Injectable } from '@angular/core';
//import { Buffer } from 'buffer;'
const Buffer = require('buffer').Buffer;
@Injectable({
  providedIn: 'root'
})

export class ImageService {
 // private _PARAM_LOCATION = 'mamboleofc/site';
  private _PARAM_FRONTCLOUD = 'https://d1rnutpibukanj.cloudfront.net';

  constructor() { }

  loadImage1920x940(image) {
    const resizedImage = this.resizeWithInS3(image, {
      "resize": {
        "width": 1920,
        "height": 940,
        "fit": "cover"
      }
    });

    return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }

  loadImage240x128(image) {
      const resizedImage = this.resizeWithInS3(image, {
          "resize": {
              "width": 240,
              "height": 128,
              "fit": "cover"
          }
      });

      return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }
  loadImage270x270(image) {
    const resizedImage = this.resizeWithInS3(image, {
      "resize": {
        "width": 270,
        "height": 270,
        "fit": "inside"
      }
    });

    return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }

  loadImage400(image) {
    const resizedImage = this.resizeWithInS3(image, {
      "resize": {
        "width": 400,
        "fit": "cover"
      }
    });

    return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }

  loadImage450x450(image) {
    const resizedImage = this.resizeWithInS3(image, {
      "resize": {
        "width": 450,
        "height": 450,
        "fit": "cover"
      }
    });

    return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }

  loadImage500x500(image) {
    const resizedImage = this.resizeWithInS3(image, {
      "resize": {
        "width": 500,
        "height": 500,
        "fit": "cover"
      }
    });

    return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }

  loadImage500x251(image) {
    const resizedImage = this.resizeWithInS3(image, {
      "resize": {
        "width": 500,
        "height": 251,
        "fit": "cover"
      }
    });

    return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }

  loadImage290x450(image) {
    const resizedImage = this.resizeWithInS3(image, {
      "resize": {
        "width": 290,
        "height": 450,
        "fit": "cover"
      }
    });

    return `${this._PARAM_FRONTCLOUD}/${resizedImage}`;
  }



  /**
   * Setup Signature so that a specific bucket and key are resized with the resized serverless app that is running along with the edits
   * being applied
   * @param key
   * @param edits
   */
  public resizeWithInS3(key: string, edits: EditProperties) {
    const imageRequest = JSON.stringify({
      bucket: "tomvisions-original-images",
      key: key,
      edits: edits
    })

    return `${Buffer.from(imageRequest).toString('base64')}`;
  }
}

export interface EditProperties {
  "resize": {
    width?: number,
    height?: number,
    fit?: string
  }
}

