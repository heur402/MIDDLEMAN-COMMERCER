import JSZip from 'jszip'
import { asyncHandler } from '../utils/asyncHandler.js'

const LISTING_HEADERS  = ['title', 'description', 'price', 'stock', 'category', 'condition', 'status', 'tags']
const LISTING_EXAMPLE  = ['Blue Denim Jacket', 'Classic fit size M', '25.99', '10', 'Clothing', 'new', 'draft', 'jacket,denim']

const CATEGORY_HEADERS = ['name', 'description', 'icon', 'active']
const CATEGORY_EXAMPLE = ['Electronics', 'Phones laptops and gadgets', '💻', 'true']

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function xmlRow(cells, bold = false) {
  const rpr = bold ? '<w:rPr><w:b/></w:rPr>' : ''
  const tds = cells.map((c) =>
    `<w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:r>${rpr}<w:t xml:space="preserve">${esc(c)}</w:t></w:r></w:p></w:tc>`
  ).join('')
  return `<w:tr>${tds}</w:tr>`
}

async function buildDocx(headers, exampleRow) {
  const borders = ['top','left','bottom','right','insideH','insideV']
    .map((b) => `<w:${b} w:val="single" w:sz="4" w:space="0" w:color="auto"/>`)
    .join('')

  const grid = headers.map(() => '<w:gridCol w:w="1800"/>').join('')

  const table = [
    `<w:tbl>`,
    `<w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/>`,
    `<w:tblBorders>${borders}</w:tblBorders></w:tblPr>`,
    `<w:tblGrid>${grid}</w:tblGrid>`,
    xmlRow(headers, true),
    xmlRow(exampleRow),
    // 5 blank data rows
    ...Array(5).fill(xmlRow(headers.map(() => ''))),
    `</w:tbl>`,
  ].join('')

  const documentXml = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`,
    `<w:body>${table}<w:sectPr/></w:body></w:document>`,
  ].join('')

  const zip = new JSZip()
  zip.file('[Content_Types].xml', [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`,
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`,
    `<Default Extension="xml" ContentType="application/xml"/>`,
    `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`,
    `</Types>`,
  ].join(''))

  zip.file('_rels/.rels', [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>`,
    `</Relationships>`,
  ].join(''))

  zip.file('word/document.xml', documentXml)

  zip.file('word/_rels/document.xml.rels', [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`,
  ].join(''))

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}

export const downloadListingsTemplate = asyncHandler(async (_req, res) => {
  const buf = await buildDocx(LISTING_HEADERS, LISTING_EXAMPLE)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.setHeader('Content-Disposition', 'attachment; filename="listings_template.docx"')
  res.send(buf)
})

export const downloadCategoriesTemplate = asyncHandler(async (_req, res) => {
  const buf = await buildDocx(CATEGORY_HEADERS, CATEGORY_EXAMPLE)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.setHeader('Content-Disposition', 'attachment; filename="categories_template.docx"')
  res.send(buf)
})
