import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Navbar from "./Navbar";
import Pdf from "./Pdf";
import Button from "./components/Button";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // onchange event
  const handlePdfFileChange = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setPdfFile(e.target.result);
          setPdfFileError("");
        };
      } else {
        setPdfFile(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  return (
    <div>
      <Navbar hasPDF={pdfFile} />
      {!pdfFile && (
        <>
          <Pdf />
          <Button handlePdfFileChange={handlePdfFileChange} />
        </>
      )}
      {pdfFile && (
        <div style={{ backgroundColor: "#f7f7f7" }}>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            className="document"
          >
            <Page pageNumber={pageNumber} className="page" />
          </Document>
        </div>
      )}
    </div>
  );
}

export default App;
