# Leaf Hair landing page

1. สร้าง Google Sheet ชื่อ Leaf Hair Orders แถวที่ 1 พิมพ์หัวคอลัมน์ตามลำดับ:
   วันเวลา | เลขที่ออเดอร์ | ชื่อผู้รับ | เบอร์โทร | ที่อยู่ | รหัสไปรษณีย์ | SKU | รายการ | จำนวน | ยอดรวม | หมายเหตุ | สถานะ
2. Extensions > Apps Script วางโค้ดจาก apps-script.gs > Deploy > Web app (Execute as: Me, Anyone) แล้วคัดลอก URL
3. File > Share > Publish to web > เลือกชีต > CSV แล้วคัดลอกลิงก์
4. เปิด script.js วาง URL ทั้งสองแทน PASTE_... ที่บรรทัดบนสุด
5. อัปโหลดทั้งโฟลเดอร์ (รวม images/) ขึ้น GitHub แล้ว Import เข้า Vercel
