import { useState } from "react";
import { pdfjs } from "react-pdf";
import { fabric } from 'fabric';
import { jsPDF } from "jspdf";

import Navbar from "./Navbar";
import Pdf from "./Pdf";
import Button from "./components/Button";
import Dialog from "./components/Dialog";
// import Loading from "./components/Loading";
import styled from "styled-components";
import CreateSignOverlap from "./components/CreateSignOverlap";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const StyledCanvas = styled.canvas`
  border: black 2px solid;
`;
const CanvasWrapper = styled.div`
  display: flex;

  &.hide {
    display: none;
  }

  > div {
    display: none;
  }

  > div:nth-child(${props => props.currentPage}) {
    display: unset;
  }

  div {
    margin: 0 auto;
  }
`;
const PageSwitcher = styled.span`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: rgba(255,255,255, 0.8);

  .page-nums {

  }
`;

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState();
  const [hasPDF, setHasPDF] = useState(false);
  const [open, setOpen] = useState(false);
  const [exportFile, setExportFile] = useState(false);
  const [showCreateSignOverlap, setShowCreateSignOverlap] = useState(false);
  const [canvasStateList, setCanvasStateList] = useState([]);

  // 使用原生 FileReader 轉檔
  function readBlob(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    });
  }

  async function getPdfCanvas(pdfDoc, page) {
    const pdfPage = await pdfDoc.getPage(page);

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
  };

  async function printPDF(pdfData) {

    // 將檔案處理成 base64
    pdfData = await readBlob(pdfData);

    // 將 base64 中的前綴刪去，並進行解碼
    const Base64Prefix = "data:application/pdf;base64,";
    const data = atob(pdfData.substring(Base64Prefix.length));

    // 利用解碼的檔案，載入 PDF 檔
    const pdfDoc = await pdfjs.getDocument({ data }).promise;
    setCurrentPage(1);
    setNumPages(pdfDoc.numPages);

    const canvasList = [];
    for (let i = 0; i < pdfDoc.numPages; i++) {
      canvasList.push(await getPdfCanvas(pdfDoc, i + 1));
    }

    return canvasList;
  }

  async function pdfToImage(pdfData) {

    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;

    // 回傳圖片
    return new fabric.Image(pdfData, {
      scaleX: scale,
      scaleY: scale,
    });
  }

  const getFabricCanvas = async (pdfData, index) => {
    const pdfImage = await pdfToImage(pdfData[index]);

    const canvas = new fabric.Canvas(`pdf-canvas${index + 1}`);
    canvas.requestRenderAll();

    // 透過比例設定 canvas 尺寸
    canvas.setWidth(pdfImage.width / window.devicePixelRatio);
    canvas.setHeight(pdfImage.height / window.devicePixelRatio);

    // 將 PDF 畫面設定為背景
    canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
    return canvas;
  };

  const handlePdfFileChange = async (e) => {
    const pdfData = await printPDF(e.target.files[0]);

    const newList = [];
    for (let i = 0; i < pdfData.length; i++) {
      newList.push(await getFabricCanvas(pdfData, i));
    }

    setHasPDF(true);
    setCanvasStateList(newList);
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
      canvasStateList[currentPage - 1].add(image);
    });
    setShowCreateSignOverlap(false);
  };

  const handleExport = () => {
    const pdf = new jsPDF();
    canvasStateList.forEach((c, index) => {
      // 將 canvas 存為圖片
      const image = c.toDataURL("image/png");

      // 設定背景在 PDF 中的位置及大小
      const width = pdf.internal.pageSize.width;
      const height = pdf.internal.pageSize.height;
      pdf.addImage(image, "png", 0, 0, width, height);

      if (index !== canvasStateList.length - 1) {
        pdf.addPage();
      }
    });

    // 將檔案取名並下載
    pdf.save("download.pdf");
    setOpen(false);
  };

  const handleAbort = () => {
    canvasStateList.forEach(c => {
      c.dispose();
    });
    setHasPDF(false);
    setOpen(false);
    setCanvasStateList([]);
  };

  return (
    <>
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
      <CanvasWrapper currentPage={currentPage} className={hasPDF ? '' : "hide"}>
        {new Array(numPages).fill(true).map((_, index) => <StyledCanvas id={`pdf-canvas${index + 1}`} />)}

        <PageSwitcher>
          {currentPage > 1 && <span onClick={() => setCurrentPage(prev => prev - 1)}>上一頁</span>}
          <span className="page-nums">{currentPage} / {numPages}</span>
          {currentPage < numPages && <span onClick={() => setCurrentPage(prev => prev + 1)}>下一頁</span>}
        </PageSwitcher>
      </CanvasWrapper>

      {showCreateSignOverlap && <CreateSignOverlap handleCreateSign={handleCreateSign} />}
      <Dialog
        open={open}
        setOpen={setOpen}
        exportFile={exportFile}
        handleAbort={handleAbort}
        handleExport={handleExport}
      />
    </>
  );
}

export default App;
