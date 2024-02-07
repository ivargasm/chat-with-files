import type { APIRoute } from "astro";
import { boolean } from "astro/zod";
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import fs from 'node:fs/promises'
import path from "node:path";

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET
})

const outputDir = path.join(process.cwd(), 'public/text')

// subir archivo a cloudinary
const uploadStream = async ( buffer: Uint8Array, options: {
    folder: string,
    ocr?: string
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
        folder: 'chat-with-pdf', // carpeta donde se guardaran los archivos
        ocr: 'adv_ocr' // reconocimiento de texto de la imagen (opcional)
    })

    const {
        asset_id: id,
        secure_url: url,
        pages,
        info
    } = response

    const data = info?.ocr?.adv_ocr?.data

    const text = data.map((blocks: {textAnnotations:{description:string}[]})=>{
        const annotations = blocks['textAnnotations'] ?? {}
        const first = annotations[0] ?? {}
        const content = first['description'] ?? {}
        return content.trim()
    }).filter(Boolean).join('\n')

    // lo ideal seria mandarlo a una base de datos
    fs.writeFile(`${outputDir}/${id}.txt`, text, 'utf-8')

    return new Response(JSON.stringify({
        id,
        url,
        pages
    }));
}