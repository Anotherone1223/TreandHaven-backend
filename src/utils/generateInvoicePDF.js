// utils/generateInvoicePDF.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generateInvoicePDF(htmlContent, orderId) {
  const outputPath = path.join(__dirname, `../invoices/${orderId}.pdf`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return outputPath; // return for Cloudinary upload
}

module.exports = generateInvoicePDF;
