import ImageKit, { toFile } from '@imagekit/nodejs';
import config from '../config/config.js'


const client = new ImageKit({
    privateKey:config.IMAGEKIT_KEY
});


const uploadFiles = async ({buffer,fileName})=>{
    const response = await client.files.upload({
        file:await toFile(buffer),
        fileName:fileName,
        folder:"snitch"
    })
    return response;
}

export default uploadFiles;