const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Phục vụ các file tĩnh từ các thư mục cụ thể
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));

// Route phục vụ trang chủ (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API để lưu đơn hàng vào CSV
app.post("/save_order", (req, res) => {
    const { orderDetails, orderSummary } = req.body;

    if (!orderDetails || !orderSummary) {
        return res.status(400).json({ message: "Dữ liệu đơn hàng không hợp lệ!" });
    }

    const dataDir = path.join(__dirname, "javascript", "Data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    const orderDetailsFile = path.join(dataDir, "order_details.csv");
    const orderSummaryFile = path.join(dataDir, "order_summary.csv");

    if (!fs.existsSync(orderDetailsFile)) {
        fs.writeFileSync(orderDetailsFile, "ID đơn hàng,Tên sản phẩm,Thể loại,Giá,Số lượng,Tổng tiền\n");
    }

    if (!fs.existsSync(orderSummaryFile)) {
        fs.writeFileSync(orderSummaryFile, "ID đơn hàng,Tổng tiền,Ngày giờ thanh toán\n");
    }

    try {
        let orderDetailsData = orderDetails.map(item => 
            `${item.orderID},${item.name},${item.category},${item.price},${item.quantity},${item.total}`
        ).join("\n");

        fs.appendFileSync(orderDetailsFile, orderDetailsData + "\n");
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lưu order_details!" });
    }

    try {
        let orderSummaryData = `${orderSummary.orderID},${orderSummary.totalAmount},${orderSummary.orderTime}\n`;
        fs.appendFileSync(orderSummaryFile, orderSummaryData);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lưu order_summary!" });
    }

    res.json({ message: "Lưu đơn hàng thành công!" });
});

// Xử lý tất cả các route khác để trả về index.html (cho SPA)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = app; // Cần cho Vercel xử lý serverless
