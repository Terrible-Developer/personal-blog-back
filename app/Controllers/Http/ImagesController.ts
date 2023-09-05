// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone"
import Drive from "@ioc:Adonis/Core/Drive"

/* targets are posts, users and misc
  * posts: for images related to posts in any way
  * users: for user related images, types being avatar, banner, or other for now
  * misc: anything else, website banners, side images, or whatever else needed
*
interface ImageObject {
  image: MultipartFileContract, //image itself
  target: string,
  id: string | null, //id of the post or user
  imageType: string | null, //
}*/

export default class ImagesController {imageimage
   /*
     *
     */

   public async uploadImageDEBUG({ request, response }: HttpContext) {
      //const image = request.file('uploaded_image')
      console.log(request.allFiles())
      return request.file("uploaded_image")
   }

   public async uploadSingleImage({ request, response }: HttpContext) {
     let image = request.file('uploaded_image', {
       size: '2mb',
       extnames: [ 'jpg', 'png' ]
     });
     if(!image)
       return response.send({
         message: 'There was a problem with the uploaded file. Please try again or try a different file'
       });
     const params: Record<string, any> = request.body();
     const name = await this.generateImageName(params.id, params.target, params.type, image.extname);
     await image.moveToDisk('./', { name: name});
     response.send({
       message: 'Image uploaded successfully'
     });
   }

   private async generateImageName(id: number, target: string, imageType: string, fileExt: string | undefined): Promise<string> {
     let name = `0${id}`;
     switch(target){
       case 'user':
         name += '01';
         break;
       case 'post':
         name += '02';
         break;
       case 'misc':
         name += '03';
         break;
       default:
         name += '00';
         break;
     }
     switch(imageType){
       case 'avatar':
         name += '10';
         break;
       case 'banner':
         name += '11';
         break;
       case 'postTop':
         name += '20';
         break;
       case 'postMid':
         name += '21';
         break;
       case 'other':
         name += '30';
         break;
       default:
         name += '00';
         break;
     }
     let count: number = 0;
     while(await Drive.exists(`./${name}.${fileExt}`)){
       if(count > 0){
         name = name.slice(0, name.length - 3);
       }
       count++;
       name = `${name}(${count})`;
     }
     name += `.${fileExt}`;

     return name;
   }
}
