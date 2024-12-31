import {Elysia} from 'elysia';
import multer from 'multer';



const app = new Elysia();

const fileStorage = multer.diskStorage({
    destination:(request, file, clb)=>{
        clb(null, './uploads');
    },
    filename:(request, file, clb)=>{
        clb(null, Date.now()+'---'+file.originalname);
    },
})


const upload = multer({ storage: fileStorage })
const singleUpload = upload.single("image");
const multUpload = upload.array("images", 10);
app
.get('/',()=> {return new Response(Bun.file("./public/index.html"))})
.post('/uploadS', async ({ request })=>{
    try{
    const fileData = await new Promise((resolve, reject) => {
        singleUpload(request as any, {} as any, (err: any) => {
          if (err) return reject(err);
          resolve((request as any).file);
        });
      });
    console.log("Uploaded : ", (fileStorage as any).path);
    return { message: 'File uploaded successfully!', file: (fileStorage as any).path };
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
                resolve((request as any).files);
            }
        })
    })
    console.log("Uploaded : ",filesData);
    return { message: 'Files have been uploaded successfully!', file: filesData };
    }catch(err){
        console.log("Error:", err);
        return { Error: "Files upload failed successfully" , details: err }
        
    }
})




.listen(5000,()=>{
    console.log(`Server running on port ${5000}`);
})
