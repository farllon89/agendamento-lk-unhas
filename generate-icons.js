const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Criar diretório public se não existir
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Criar ícone SVG simples
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="#ec4899"/>
  <circle cx="256" cy="200" r="80" fill="white"/>
  <rect x="176" y="320" width="160" height="80" rx="40" fill="white"/>
  <text x="256" y="460" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">A</text>
</svg>
`;

// Gerar ícones PNG de diferentes tamanhos
async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(path.join('public', `icon-${size}.png`));

    console.log(`Ícone icon-${size}.png gerado`);
  }
}

generateIcons().catch(console.error);