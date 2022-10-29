// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone"

export default class ImagesController {

   public async getImage(request: HttpContext) {

   }

   public async uploadImageDEBUG({ request, response }: HttpContext) {
      //const image = request.file('uploaded_image')
      console.log(request.allFiles())
      return request.file("uploaded_image")
   }

   public async uploadSingleImage({ request, response }: HttpContext) {
	   let image = request.file('uploaded_image', {
		size: '2mb',
		extnames: [ 'jpg', 'png' ]
	   })
	   if(!image)
		   return response.send({
			   message: 'There was a problem with the uploaded file. Please try again or try a different file'
		   })
	   let params: Record<string, any> = request.body()
	   let target: string = params.target
	   let id: string = params.id
	   let imageType: string = params.type


	   image?.moveToDisk(`./${target}/${id}/${imageType}`)

	   return response.send({
		   message: 'Image uploaded successfully'
	   })
   }


   public async getImage(request: HttpContext) {

   }
}
