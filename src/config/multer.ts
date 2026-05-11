import multer from "multer";

// Usar o memory storage do multer para armazenar os arquivos em memória, enviar diretamente para o Cloudinary

export default{
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB por arquivo
    }, fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png'
        ];

        if(allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo inválido. Apenas JPEG e PNG são permitidos."));
        }
    }
}