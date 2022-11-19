import React from "react";
import styled from "styled-components";

const DialogContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  padding: 0 32px;
  z-index: 1;
  transform: translate(-50%, -50%);
`;

const DialogBody = styled.div`
  position: relative;
  max-width: 560px;
  height: 208px;
  margin: 0 auto;
  background-color: var(--color-white);
  z-index: 1;
  padding: 16px;
  box-shadow: 0px 24px 38px 0px #00000024;

  p {
    font-size: 20px;
    padding: 8px 16px;
  }
  p:nth-child(2) {
    font-size: 16px;
  }

  span {
    padding: 6px 8px;
    margin-left: 24px;
    cursor: pointer;
  }
  .drop_file {
    color: var(--color-red);
  }

  .export_file {
    color: var(--color-primary);
  }

  div {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 14px;
    text-align: end;
    width: 100%;
  }

  @media screen and (min-width: 624px) {
    p {
      padding: 22px 24px;
    }
    p:nth-child(2) {
      padding: 8px 24px;
    }
    span {
      padding: 8px 28px;
    }
    div {
      padding: 20px;
    }
  }
`;

const Dialog = ({ open, setOpen, exportFile, handleAbort, handleExport }) => {
  return (
    <DialogContainer style={{ display: !open && "none" }}>
      <DialogBody>
        <p>{exportFile ? "完成簽署文件?" : "放棄簽署文件?"}</p>
        <p>{exportFile ? "文件將被輸出" : "文件將被刪除"}</p>
        <div>
          <span onClick={() => setOpen(false)}>取消</span>
          {exportFile ? (
            <span onClick={handleExport} className="export_file">
              完成
            </span>
          ) : (
            <span onClick={handleAbort} className="drop_file">
              放棄
            </span>
          )}
        </div>
      </DialogBody>
    </DialogContainer>
  );
};

export default Dialog;
