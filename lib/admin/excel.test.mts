import assert from "node:assert/strict";
import test from "node:test";
import { buildXlsx, XLSX_CONTENT_TYPE } from "./excel.ts";

const u16=(b:Uint8Array,o:number)=>b[o]|(b[o+1]<<8);const u32=(b:Uint8Array,o:number)=>{let v=0;for(let i=3;i>=0;i--)v=v*256+b[o+i];return v>>>0;};

test("buildXlsx produces a parseable stored-zip workbook", () => {
  const file = buildXlsx("Applications", [
    ["Full name", "USN", "Applied & <noted>"],
    ["Sai 'quote' Kumar", "", "Line1\nLine2"],
    ["Ünïcode ✓ 🙂", "BMSIT001", "优惠"],
  ]);

  assert.equal(u32(file, 0), 0x04034b50, "local header signature");

  // Walk every entry via its local header, verifying CRC and sizes.
  const names: string[] = [];
  let offset = 0;
  while (offset + 4 <= file.length && u32(file, offset) === 0x04034b50) {
    const nameLen = u16(file, offset + 26);
    const extraLen = u16(file, offset + 28);
    const size = u32(file, offset + 18);
    const name = Buffer.from(file.subarray(offset + 30, offset + 30 + nameLen)).toString();
    const data = file.subarray(offset + 30 + nameLen + extraLen, offset + 30 + nameLen + extraLen + size);
    assert.equal(u32(file, offset + 14), crc(data), `crc of ${name}`);
    names.push(name);
    offset += 30 + nameLen + extraLen + size;
  }
  assert.deepEqual(names.sort(), [
    "[Content_Types].xml",
    "_rels/.rels",
    "xl/_rels/workbook.xml.rels",
    "xl/workbook.xml",
    "xl/worksheets/sheet1.xml",
  ]);

  const workbook = Buffer.from(file).toString("latin1");
  assert.ok(workbook.includes('name="Applications"'), "sheet name present");
  assert.ok(workbook.includes('<t xml:space="preserve">Applied &#38; &#60;noted&#62;</t>'), "XML escaping");
  assert.ok(workbook.includes("Line1\nLine2"), "newlines kept verbatim");
  assert.ok(Buffer.from(file).includes(Buffer.from("Ünïcode ✓ 🙂", "utf8")), "unicode preserved");
});

test("cells render as inline strings and empty values as empty cells", () => {
  const file = Buffer.from(buildXlsx("S", [["a", "", "b"], ["", "x", ""]])).toString("utf8");
  assert.ok(file.includes('t="inlineStr"'), "inline strings");
  assert.match(file, /<c r="B1"\/>/, "empty cell");
});

test("content type constant matches the xlsx media type", () => {
  assert.equal(XLSX_CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
});

function crc(data: Uint8Array): number {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const byte of data) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
