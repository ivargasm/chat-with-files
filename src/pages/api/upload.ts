import type { APIRoute } from "astro";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET
})

// subir archivo a cloudinary
const uploadStream = async ( buffer: Uint8Array, options: {
    folder: string
}): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary
            .uploader
            .upload_stream(options, (error, result) => {
                if(result) return resolve(result)
                reject(error)
            }).end(buffer)
    })
}

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // validar si existe archivo
    if(file == null) return new Response('No hay archivo', { status: 400 })

    // transformar archivo en arraybuffer
    const arrayBuffer = await file.arrayBuffer();
    const unit8Array = new Uint8Array(arrayBuffer);

    const response = await uploadStream(unit8Array, {
        folder: 'chat-with-pdf' // carpeta donde se guardaran los archivos
    })

    const {
        asset_id: id,
        secure_url: url,
        pages
    } = response

    return new Response(JSON.stringify({
        id,
        url,
        pages
    }));
}