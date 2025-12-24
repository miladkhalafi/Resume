const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Starting PDF generation...');
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
      headless: 'new'
    });
    const page = await browser.newPage();
    
    // Path to the generated HTML file
    const htmlPath = path.join(__dirname, 'resume.html');
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`HTML file not found at ${htmlPath}`);
    }

    const htmlUrl = `file://${htmlPath}`;
    console.log(`Loading HTML from: ${htmlUrl}`);
    
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });
    
    console.log('Generating PDF...');
    await page.pdf({
      path: 'resume.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    console.log('PDF generated successfully.');
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
})();
