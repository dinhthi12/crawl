const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function crawlImages(url, outputFolder) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Lấy tất cả đường dẫn hình ảnh từ trang
  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => img.src);
  });

  // Tạo thư mục đầu ra nếu chưa tồn tại
  await fs.mkdir(outputFolder, { recursive: true });

  // Tải và lưu hình ảnh
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];
    const imageFileName = `image_${i + 1}.jpg`; // Tên file có thể thay đổi tùy ý
    const imagePath = path.join(outputFolder, imageFileName);

    // Tải hình ảnh
    await page.goto(imageUrl, { waitUntil: 'networkidle2' });
    const imageBuffer = await page.screenshot();

    // Lưu hình ảnh vào thư mục đầu ra
    await fs.writeFile(imagePath, imageBuffer);
    console.log(`Image ${i + 1} saved to ${imagePath}`);
  }

  await browser.close();
}

// Lấy URL và thư mục đầu ra từ tham số dòng lệnh
const url = process.argv[2];
const outputFolder = process.argv[3];

// Kiểm tra xem có URL và thư mục đầu ra được cung cấp không
if (!url || !outputFolder) {
  console.error('Vui lòng cung cấp URL và thư mục đầu ra.');
  process.exit(1); // Thoát chương trình với mã lỗi
}

// Gọi hàm để cào hình ảnh
crawlImages(url, outputFolder);
