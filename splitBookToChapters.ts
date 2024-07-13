import { PDFDocument } from 'pdf-lib'
import _ from 'lodash'
import path from 'path'
import { startingPages, offset } from './startingPages'
import { readPdf } from './pdf utils/readPdf'
import { extractPages } from './pdf utils/extractPages'
import { writePdfToFile } from './pdf utils/writePdfToFile'

function splitPdfToChapterPdfs(
  startingPages: number[],
  srcPdfDoc: PDFDocument,
  offset: number
) {
  const promises = startingPages
    .slice(0, startingPages.length - 1)
    .map(async (startPage, index) =>
      extractPages(
        srcPdfDoc,
        startPage + offset - 1,
        startingPages[index + 1] + offset - 1
      )
    )

  return Promise.all(promises)
}

function getChapterName(chapterNumber: number, numberOfChapters: number) {
  if (chapterNumber === 0) return 'Preliminaries'
  if (chapterNumber === numberOfChapters + 1) return 'Appendices'
  return `Chapter-${chapterNumber}`
}

function getChapterPath(
  outputPath: string,
  chapterNumber: number,
  numberOfChapters: number
) {
  const fileName = getChapterName(chapterNumber, numberOfChapters) + '.pdf'
  return path.join(outputPath, fileName)
}

async function writeChapterPdfToFile(
  pdf: PDFDocument,
  chapterNumber: number,
  outputDirPath: string,
  numberOfChapters: number
) {
  const chapterPath = getChapterPath(
    outputDirPath,
    chapterNumber,
    numberOfChapters
  )
  writePdfToFile(pdf, chapterPath)
}

async function writeAllChapterPdfsToFiles(
  chapterPdfs: PDFDocument[],
  outputDirPath: string
) {
  const writePromises = chapterPdfs.map(
    (pdf, index) =>
      writeChapterPdfToFile(pdf, index, outputDirPath, chapterPdfs.length - 2) // -2 for the preliminary and appendix chapters
  )
  return Promise.all(writePromises)
}

function addStartAndEndPages(
  startingPages: number[],
  offset: number,
  numPages: number
) {
  return [
    1 - offset, // hypothetical printed page number for pdf page 1
    ...startingPages,
    numPages + 1 - offset, // hypothetical printed page number for 1 + last pdf page
  ]
}

async function splitBookToChapters(
  srcPdfPath: string,
  outputDirPath: string,
  startingPages: number[],
  offset: number
) {
  const srcPdfDoc = await readPdf(srcPdfPath)

  const updatedStartingPages = addStartAndEndPages(
    startingPages,
    offset,
    srcPdfDoc.getPageCount()
  )

  const chapterPdfs = await splitPdfToChapterPdfs(
    updatedStartingPages,
    srcPdfDoc,
    offset
  )

  await writeAllChapterPdfsToFiles(chapterPdfs, outputDirPath)
}

const srcPdfPath =
  'D:/books/grokking/grokking-simplicity-taming-complex-software-with-functional-thinking-1nbsped-1617296201-9781617296208_compress.pdf'
const outputDirPath = 'D:/books/grokking/simplicity' // Output directory shall be created before running the script

splitBookToChapters(srcPdfPath, outputDirPath, startingPages, offset)
