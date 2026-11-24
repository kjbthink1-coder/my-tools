import qrcode
import qrcode.image.svg
import re

factory = qrcode.image.svg.SvgPathImage
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=1,
    image_factory=factory
)
qr.add_data('https://jieungak-report.pages.dev/')
qr.make(fit=True)
img = qr.make_image()
svg_str = img.to_string(encoding='unicode')

m = re.search(r'd="([^"]+)"', svg_str)
if m:
    with open('C:/Users/user/Desktop/프로그램/이미지변환기/qr_path.txt', 'w', encoding='utf-8') as f:
        f.write(m.group(1))
    print('QR Path for jieungak-report extracted successfully! Length:', len(m.group(1)))
else:
    print('Failed to extract QR Path')
