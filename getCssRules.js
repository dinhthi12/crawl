const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function getCssRules(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Lấy tất cả quy tắc CSS đã áp dụng cho trang
  const cssRules = await page.evaluate(() => {
    const styleSheets = Array.from(document.styleSheets);
    const allRules = [];

    styleSheets.forEach(styleSheet => {
      try {
        const rules = Array.from(styleSheet.rules || styleSheet.cssRules);
        allRules.push(...rules);
      } catch (error) {
        console.error(`Error reading rules from stylesheet: ${styleSheet.href}`);
      }
    });

    return allRules.map(rule => rule.cssText);
  });

  await browser.close();

  return cssRules;
}

async function saveCssToFile(url, filePath) {
  try {
    const cssRules = await getCssRules(url);
    const cssContent = cssRules.join('\n');

    await fs.writeFile(filePath, cssContent);
    console.log(`CSS rules saved to ${filePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Lấy URL và đường dẫn tệp từ tham số dòng lệnh
const url = process.argv[2];
const filePath = process.argv[3];

// Kiểm tra xem có URL và đường dẫn tệp được cung cấp không
if (!url || !filePath) {
  console.error('Vui lòng cung cấp URL và đường dẫn tệp.');
  process.exit(1); // Thoát chương trình với mã lỗi
}

// Gọi hàm để lưu CSS vào tệp
saveCssToFile(url, filePath);
