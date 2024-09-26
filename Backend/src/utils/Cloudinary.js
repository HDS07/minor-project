import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { type } from "os";

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfull
        //console.log("File is Uploaded on cloudinary :- ",response.url)
        fs.unlinkSync(localFilePath)
        return response
    }catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const destroyFromCloudinary=async(imageUrl)=>{
    try{
        console.log(imageUrl)
        const urlArray=imageUrl.split('/')
        const image=urlArray[urlArray.length-1]
        const publicUrl=image.split('.')[0]
        console.log(publicUrl)
        await cloudinary.uploader.destroy(publicUrl,(error,result)=>{
            if(error){
                console.log("Error :- ",error)
            }else{
                console.log("Result :- ",result)
            }
        })
    }catch(error){
        console.log("Error :- ",error)
    }
}

export {uploadOnCloudinary,destroyFromCloudinary}