import { PDFDocument } from 'pdf-lib'
import fs from 'fs'

export async function readPdf(pdfPath: string) {
  const pdfBytes = fs.readFileSync(pdfPath)
  const pdfDoc = await PDFDocument.load(pdfBytes)
  return pdfDoc
}
