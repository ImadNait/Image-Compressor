import {Elysia} from 'elysia';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';


const app = new Elysia();

const fileStorage = multer.diskStorage({
    destination:(req, file, clb)=>{
        clb(null, './uploads');
    },
    filename:(req, file, clb)=>{
        clb(null, Date.now()+'---'+file.originalname);
    },
})


const upload = multer({ storage: fileStorage })
const singleUpload = upload.single("image");
const multUpload = upload.array("image");
app
.get('/',()=> {return 'TEST TEST'})
.post('/uploadS', async ({ request })=>{
    try{
    const fileData = await new Promise((resolve, reject) => {
        singleUpload(request as any, {} as any, (err: any) => {
          if (err) return reject(err);
          resolve((request as any).file);
        });
      });
    console.log("Uploaded : ",fileData);
    return "File uploaded successfully!"
    }catch(err){
        console.error("Error: ",err);
        return { Error: "File upload failed successfully" , details: err }
    }

})

.post("/uploadM",async({ request })=>{
    try{
    const filesData = await new Promise((resolve, reject)=>{
        multUpload(request as any, {} as any, (err:any)=>{
            if(err){
                return reject(err);
            }else{
                resolve((request as any).file);
            }
        })
    })
    }catch(err){
        console.log("Error:", err);
        return { Error: "File upload failed successfully" , details: err }
        
    }
})




.listen(5000,()=>{
    console.log(`Server running on port ${5000}`);
})
