import { PDFDocument } from 'pdf-lib'

export async function mergePdfs(pdfs: PDFDocument[]) {
  const mergedPdf = await PDFDocument.create()
  for (const pdf of pdfs) {
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => mergedPdf.addPage(page))
  }
  return mergedPdf
}
