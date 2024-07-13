import { PDFDocument } from 'pdf-lib'

export async function removePages(pdf: PDFDocument, pageIndices: number[]) {
  //   return new pdf which doesn't contain the pages with the given indices
  const newPdf = await PDFDocument.create()
  const allIndices = pdf.getPageIndices()
  console.log(allIndices)
  const remainingIndices = allIndices.filter(
    (index) => !pageIndices.includes(index)
  )
  console.log(remainingIndices)
  const copiedPages = await newPdf.copyPages(pdf, remainingIndices)
  copiedPages.forEach((page, index) => newPdf.addPage(page))
  return newPdf
}
