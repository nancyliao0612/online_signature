import { useCallback, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { fabric } from 'fabric';
import { jsPDF } from "jspdf";

import Navbar from "./Navbar";
import Pdf from "./Pdf";
import Button from "./components/Button";
import Dialog from "./components/Dialog";
import Loading from "./components/Loading";
import styled from "styled-components";
import CreateSignButton from "./components/CreateSignButton";
import CreateSignOverlap from "./components/CreateSignOverlap";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const test = document.documentElement.scrollHeight > window.innerHeight;

const PdfContainer = styled.section`
  background-color: #f7f7f7;
  margin: 60px;
  /* height: ${(props) => props.test} ? 100% : 100vh */
`;
const StyledCanvas = styled.canvas`
  border: black 2px solid;
`;
const CanvasWrapper = styled.div`
  &.hide {
    display: none;
  }

  div {
    margin: 0 auto;
  }
`;

console.log("body. scrollHeight", document.documentElement.scrollHeight);
console.log("window. innerHeight", window.innerHeight);

function App() {
  const [numPages, setNumPages] = useState(null);
  const [hasPDF, setHasPDF] = useState(false);
  const [pdfFileError, setPdfFileError] = useState("");
  const [open, setOpen] = useState(false);
  const [exportFile, setExportFile] = useState(false);
  const [showCreateSignOverlap, setShowCreateSignOverlap] = useState(false);
  const [canvasState, setCanvasState] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const numArray = [];
  for (let i = 1; i <= numPages; i++) {
    numArray.push(i);
  }

  // onChange event
  // const handlePdfFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     if (selectedFile) {
  //       let reader = new FileReader();
  //       reader.readAsDataURL(selectedFile);
  //       reader.onloadend = (e) => {
  //         setPdfFile(e.target.result);
  //         setPdfFileError("");
  //       };
  //     } else {
  //       setPdfFile(null);
  //       setPdfFileError("Please select valid pdf file");
  //     }
  //   } else {
  //     console.log("select your file");
  //   }
  // };
  // 使用原生 FileReader 轉檔
  function readBlob(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    });
  }

  async function printPDF(pdfData) {

    // 將檔案處理成 base64
    pdfData = await readBlob(pdfData);

    // 將 base64 中的前綴刪去，並進行解碼
    const Base64Prefix = "data:application/pdf;base64,";
    const data = atob(pdfData.substring(Base64Prefix.length));

    // 利用解碼的檔案，載入 PDF 檔及第一頁
    const pdfDoc = await pdfjs.getDocument({ data }).promise;
    const pdfPage = await pdfDoc.getPage(1);

    // 設定尺寸及產生 canvas
    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // 設定 PDF 所要顯示的寬高及渲染
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    const renderTask = pdfPage.render(renderContext);

    // 回傳做好的 PDF canvas
    return renderTask.promise.then(() => canvas);
  }

  async function pdfToImage(pdfData) {

    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;

    // 回傳圖片
    return new fabric.Image(pdfData, {
      id: "renderPDF",
      scaleX: scale,
      scaleY: scale,
    });
  }

  const handlePdfFileChange = async (e) => {
    const canvas = canvasState || new fabric.Canvas("pdf-canvas");
    canvas.requestRenderAll();
    const pdfData = await printPDF(e.target.files[0]);
    const pdfImage = await pdfToImage(pdfData);

    // 透過比例設定 canvas 尺寸
    canvas.setWidth(pdfImage.width / window.devicePixelRatio);
    canvas.setHeight(pdfImage.height / window.devicePixelRatio);

    // 將 PDF 畫面設定為背景
    canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
    setHasPDF(true);
    setCanvasState(canvas);
  };

  const handleEditClick = () => {
    setShowCreateSignOverlap(true);
  };

  const handleCreateSign = signImg => {
    fabric.Image.fromURL(signImg, function (image) {
      // 設定簽名出現的位置及大小，後續可調整
      image.top = 400;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      canvasState.add(image);
    });
    setShowCreateSignOverlap(false);
  };

  const handleExport = useCallback(() => {
    const pdf = new jsPDF();
    // 將 canvas 存為圖片
    const image = canvasState.toDataURL("image/png");

    // 設定背景在 PDF 中的位置及大小
    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;
    pdf.addImage(image, "png", 0, 0, width, height);

    // 將檔案取名並下載
    pdf.save("download.pdf");
    setOpen(false);
  }, [canvasState, setOpen]);

  const handleAbort = useCallback(() => {
    setHasPDF(false);
    setOpen(false);
  }, [setOpen]);

  return (
    <div>
      <Navbar
        hasPDF={hasPDF}
        handleEditClick={handleEditClick}
        setOpen={setOpen}
        setExportFile={setExportFile}
      />
      {!hasPDF && (
        <>
          <Pdf />
          <Button handlePdfFileChange={handlePdfFileChange} />
        </>
      )}
      <CanvasWrapper className={hasPDF ? '' : "hide"}>
        <StyledCanvas id="pdf-canvas" />
      </CanvasWrapper>
      {/* {pdfFile && (
        <PdfContainer>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            className="document"
            loading={<Loading />}
            error={false}
          >
            {numArray.length !== 0 &&
              numArray.map((numPage) => (
                <Page pageNumber={numPage} key={numPage} loading={false} />
              ))}
            
          </Document>
        </PdfContainer>
      )} */}

      {showCreateSignOverlap && <CreateSignOverlap handleCreateSign={handleCreateSign} />}
      <Dialog
        open={open}
        setOpen={setOpen}
        exportFile={exportFile}
        handleAbort={handleAbort}
        handleExport={handleExport}
      />
    </div>
  );
}

export default App;
