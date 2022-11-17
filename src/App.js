import { useState } from "react";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import Navbar from "./Navbar";
import Pdf from "./Pdf";
import Button from "./components/Button";
import Dialog from "./components/Dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");
  const [open, setOpen] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const numArray = [];
  for (let i = 1; i <= numPages; i++) {
    numArray.push(i);
  }

  // onChange event
  const handlePdfFileChange = (e) => {
    const selectedFile = e.target.files[0];
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
      <Navbar hasPDF={pdfFile} setOpen={setOpen} />
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
            <Dialog open={open} setOpen={setOpen} setPdfFile={setPdfFile} />
            {numArray.length !== 0 &&
              numArray.map((numPage) => (
                <Page pageNumber={numPage} key={numPage} />
              ))}
          </Document>
        </div>
      )}
    </div>
  );
}

export default App;
