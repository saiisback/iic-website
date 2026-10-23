// Minimal .xlsx (Office Open XML) writer.
//
// Builds a valid workbook from text-only rows without any dependency: the zip
// archive is assembled by hand using stored (uncompressed) entries, which the
// xlsx and zip specifications both allow.

const encoder = new TextEncoder();

const CRC_TABLE = new Uint32Array(256).map((_, i) => {
  let c = i;
  for (let bit = 0; bit < 8; bit++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

// ZIP with the STORE method (no compression). Entry names are ASCII.
function storedZip(entries: ZipEntry[]): Uint8Array {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const crc = crc32(entry.data);
    const size = entry.data.length;

    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true); // local file header signature
    localView.setUint16(4, 20, true); // version needed to extract
    localView.setUint16(6, 0x0800, true); // flags: UTF-8
    localView.setUint16(8, 0, true); // method: store
    localView.setUint32(14, crc, true);
    localView.setUint32(18, size, true); // compressed size
    localView.setUint32(22, size, true); // uncompressed size
    localView.setUint16(26, name.length, true);
    local.set(name, 30);
    localParts.push(local, entry.data);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true); // central directory signature
    centralView.setUint16(4, 20, true); // version made by
    centralView.setUint16(6, 20, true); // version needed to extract
    centralView.setUint16(8, 0x0800, true); // flags: UTF-8
    centralView.setUint16(10, 0, true); // method: store
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, size, true);
    centralView.setUint32(24, size, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, offset, true); // local header offset
    central.set(name, 46);
    centralParts.push(central);

    offset += local.length + size;
  }
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); // end of central directory signature
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  return concat([...localParts, ...centralParts, end]);
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

// 0 -> "A", 26 -> "AA", …
function columnLetters(index: number): string {
  let label = "";
  let n = index;
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const RELS_NAMESPACE = "http://schemas.openxmlformats.org/package/2006/relationships";
const OFFICE_RELS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const SPREADSHEET = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";

export const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** A row of plain-text cell values; empty strings produce empty cells. */
export type SheetRow = string[];

export function buildXlsx(sheetName: string, rows: SheetRow[]): Uint8Array {
  const body = rows
    .map((row, rowIndex) => row
      .map((value, columnIndex) => {
        const ref = `${columnLetters(columnIndex)}${rowIndex + 1}`;
        if (value === "") return `<c r="${ref}"/>`;
        return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
      })
      .join(""))
    .map((cells, index) => `<row r="${index + 1}">${cells}</row>`)
    .join("");

  const parts = new Map<string, string>([
    ["[Content_Types].xml", `${XML_DECLARATION}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`],
    ["_rels/.rels", `${XML_DECLARATION}<Relationships xmlns="${RELS_NAMESPACE}"><Relationship Id="rId1" Type="${OFFICE_RELS}/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ["xl/workbook.xml", `${XML_DECLARATION}<workbook xmlns="${SPREADSHEET}" xmlns:r="${OFFICE_RELS}"><sheets><sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`],
    ["xl/_rels/workbook.xml.rels", `${XML_DECLARATION}<Relationships xmlns="${RELS_NAMESPACE}"><Relationship Id="rId1" Type="${OFFICE_RELS}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`],
    ["xl/worksheets/sheet1.xml", `${XML_DECLARATION}<worksheet xmlns="${SPREADSHEET}"><sheetData>${body}</sheetData></worksheet>`],
  ]);

  return storedZip([...parts].map(([name, xml]) => ({ name, data: encoder.encode(xml) })));
}
