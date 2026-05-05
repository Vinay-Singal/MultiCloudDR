const multer = require('multer');
const storage = multer.memoryStorage(); // Files ko RAM mein rakhega
const upload = multer({ storage: storage });
module.exports = upload;