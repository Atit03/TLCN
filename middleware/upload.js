const multer = require("multer");

// Cấu hình nơi lưu trữ ảnh và kiểu file chấp nhận
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Lưu ảnh vào thư mục "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Đổi tên ảnh khi lưu
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ cho phép tải lên ảnh JPG, JPEG, PNG"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước ảnh tối đa là 5MB
  },
});

module.exports = upload;
