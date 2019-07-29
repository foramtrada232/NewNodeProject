const multer = require('multer');
/**
* Function To FileUpload Using Multer
* @param {Object} - File Object To Upload
* @returns {Array} - Return Array Of Files With Details
*/
const upload = (file) => {
   const storage = multer.diskStorage({
       destination: function (req, file, cb) {
           cb(null, './uploads/')
       },
       filename: function (req, file, cb) {
           console.log("middelware file:",file)
           cb(null, file.fieldname + '_' + Date.now())
       }
   })
   return multer({ storage: storage }).array(file); 
}

module.exports = {
   upload
}