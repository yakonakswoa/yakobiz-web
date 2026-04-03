// products.js — YAKO_BIZ (Tao boi Product Manager v3)
// Cap nhat luc: 07:40:00 03/04/2026

var PRODUCTS = [
  {
    "id": "macropilot",
    "name": "MacroPilot",
    "tagline": "Tự động hóa TikTok chuyên nghiệp",
    "description": "Đăng video hàng loạt, quản lý đa tài khoản, tự động caption & hashtag. Kết nối điện thoại qua ADB.",
    "icon": "🚀",
    "badge": "Bán chạy",
    "badgeColor": "#6c63ff",
    "features": [
      "Đăng video tự động",
      "Quản lý đa tài khoản",
      "Tự động caption & nhạc",
      "ADB USB",
      "Hỗ trợ TikTok Mod",
      "hỗ trợ đơn phone và box phone không giới hạn thiết bị"
    ],
    "plans": [
      {
        "name": "1 Tháng",
        "price": 199000
      },
      {
        "name": "3 Tháng",
        "price": 477000,
        "save": "Tiết kiệm 20%"
      },
      {
        "name": "1 Năm",
        "price": 1432000,
        "save": "Tiết kiệm 40%"
      }
    ],
    "status": "active",
    "category": "tiktok",
    "image": "images/macropilot.png",
    "downloadUrl": "https://github.com/yakonakswoa/MacroPilot-Release/releases/latest/download/MacroPilot.zip",
    "version": "1.0.15",
    "fileSize": "262 MB",
    "platform": "Windows 10/11",
    "guide": {
      "videoId": "https://www.youtube.com/watch?v=8Rs9tXv-nrw",
      "desc": "MacroPilot là phần mềm chạy trên Windows, kết nối điện thoại Android qua ADB (USB ) để tự động hóa toàn bộ quy trình đăng video TikTok.",
      "images": [
        {
          "src": "images/macropilot-guide-1775078849456.png",
          "caption": "lưu ý tắt chọn nhiều video cho lần đầu tiên trên phone"
        }
      ],
      "steps": [
        {
          "title": "Tải & giải nén phần mềm",
          "desc": "Tải file .zip từ trang Download. Giải nén ra thư mục bất kỳ. Chạy file MacroPilot.exe — không cần cài đặt."
        },
        {
          "title": "Bật USB Debugging trên điện thoại",
          "desc": "Vào Cài đặt → Giới thiệu máy → nhấn 'Số bản dựng' 7 lần để mở chế độ Developer. Sau đó bật USB Debugging."
        },
        {
          "title": "Kết nối điện thoại",
          "desc": "Cắm USB vào máy tính → nhấn nút 'Kết nối USB'. Hoặc dùng WiFi: vào cùng mạng → nhấn 'Kết nối WiFi (ADB)'."
        },
        {
          "title": "Nhập key kích hoạt",
          "desc": "Mua key tại trang chủ. Dán key vào ô 'Kích hoạt' → nhấn Xác nhận. Key tự động gắn với máy tính này."
        },
        {
          "title": "Cấu hình & chạy macro",
          "desc": "Chọn thư mục chứa video, nhập caption & hashtag, chọn tài khoản TikTok. Nhấn 'Bắt đầu' — MacroPilot tự làm hết!"
        }
      ],
      "faq": [
        {
          "q": "Cần gửi mã máy để kích hoạt không?",
          "a": "Không cần. Chỉ cần nhập key vào app, hệ thống tự xác thực online và gắn key với máy tính của bạn."
        },
        {
          "q": "Đổi máy tính thì key có dùng được không?",
          "a": "Có thể chuyển key sang máy mới. Liên hệ Zalo 0961429053 để được hỗ trợ reset — hoàn toàn miễn phí."
        },
        {
          "q": "TikTok update giao diện thì MacroPilot có chạy được không?",
          "a": "MacroPilot dùng nhận diện hình ảnh thông minh, tự thích nghi. Nếu cần, chúng tôi sẽ push bản update miễn phí."
        },
        {
          "q": "Dùng được với TikTok Mod không?",
          "a": "Có. MacroPilot hỗ trợ cả TikTok chính thống và TikTok Mod. Bạn có thể chạy song song nhiều phiên bản."
        }
      ]
    }
  },
  {
    "id": "tiktok-auto-upload",
    "name": "TikTok Auto Upload",
    "tagline": "Đăng video TikTok hàng loạt trên PC",
    "description": "Upload video tự động lên TikTok từ PC bằng Playwright. Hỗ trợ đa tài khoản, lên lịch, tự động caption.",
    "icon": "📤",
    "badge": "Mới",
    "badgeColor": "#00e676",
    "category": "tiktok",
    "status": "active",
    "image": "images/Gemini_Generated_Image_wrhx88wrhx88wrhx.jfif",
    "downloadUrl": "https://github.com/yakonakswoa/TikTokAutoUpload/releases/latest/download/TikTokAutoUpload.zip",
    "fileSize": "~80 MB",
    "version": "1.0.0",
    "platform": "Windows 10/11",
    "features": [
      "Upload hàng loạt từ PC",
      "Đa tài khoản Chrome Profile",
      "Lên lịch đăng bài",
      "Tự động caption & hashtag",
      "Hỗ trợ VPN"
    ],
    "plans": [
      {
        "name": "1 Tháng",
        "price": 30000
      }
    ],
    "guide": {
      "videoId": "",
      "desc": "TikTok Auto Upload giúp bạn đăng video hàng loạt lên TikTok từ máy tính mà không cần cầm điện thoại.",
      "images": [],
      "steps": [],
      "faq": []
    }
  }
];

var SITE = {
  "brand": "YAKO_BIZ",
  "slogan": "Phần mềm tự động — Làm ít, kiếm nhiều",
  "zalo": "0961429053",
  "zalo_url": "https://zalo.me/0961429053",
  "phone": "0961429053",
  "facebook": "https://www.facebook.com/yakogame52/",
  "telegram": "@yakogame52",
  "telegram_url": "https://t.me/yakogame52",
  "email": "",
  "bank_id": "MB",
  "bank_name": "MB Bank",
  "bank_number": "5699999999952",
  "bank_owner": "NGUYEN QUOC TUAN",
  "formspree_id": "mvzvknjp"
};
