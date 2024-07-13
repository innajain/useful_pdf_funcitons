import { PDFDocument } from 'pdf-lib'
import fs from 'fs'

export async function writePdfToFile(pdfDoc: PDFDocument, pdfPath: string) {
  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(pdfPath, pdfBytes)
}
