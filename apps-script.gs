// วางใน Google Sheet > Extensions > Apps Script แล้ว Deploy เป็น Web app (Execute as: Me, Who has access: Anyone)
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var d = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), d.orderId, d.customerName, d.phone, d.address, d.postcode, d.sku, d.items, d.qty, d.total, d.note, d.status]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
