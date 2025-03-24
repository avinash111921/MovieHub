import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, callback) {//cb--->callback
        callback(null, "./public/temp")
    },

    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

const upload = multer({storage})

export default upload