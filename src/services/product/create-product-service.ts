import { db } from '../../lib/prisma';
import { Readable } from 'stream';
import cloudinary from '../../config/cloudinary';

interface ICreateProductService {
  name: string;
  price: number;
  description: string;
  category_id: string;
  imageBuffer: Buffer;
  imageName: string;
}

export class CreateProductService {
  async execute({
    name,
    price,
    description,
    category_id,
    imageBuffer,
    imageName,
  }: ICreateProductService) {

    const categoryExists = await db.category.findFirst({
      where: {
        id: category_id,
      },
    });

    if (!categoryExists) {
      throw new Error('Categoria não existe');
    }

    let bannerUrl = '';

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image',
            public_id: `${Date.now()}-${imageName.split('.')[0]}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        const bufferStream = Readable.from(imageBuffer);
        bufferStream.pipe(uploadStream);
      });

      bannerUrl = result.secure_url;
    } catch (error) {
      console.log(error);
      throw new Error(`Erro ao fazer o upload da imagem!`);
    }

    const product = await db.products.create({
      data: {
        name,
        price,
        description,
        banner: bannerUrl,
        category_id,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        category_id: true,
        banner: true,
        createdAt: true,
      },
    });

    return product;
  }
}
