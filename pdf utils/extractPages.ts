import { PDFDocument } from 'pdf-lib'
import _ from 'lodash'

export async function extractPages(
  srcPdfDoc: PDFDocument,
  startPageIndex: number,
  endPageIndex: number
) {
  const newPdfDoc = await PDFDocument.create()
  const pagesToCopy = await newPdfDoc.copyPages(
    srcPdfDoc,
    _.range(startPageIndex, endPageIndex)
  )
  pagesToCopy.forEach((page) => {
    newPdfDoc.addPage(page)
  })
  return newPdfDoc
}
