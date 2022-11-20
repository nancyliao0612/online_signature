import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  z-index: 2;
`;

const ButtonWrapper = styled.div`
  border-radius: 4px;
  background-color: var(--color-primary);
  max-width: 384px;
  height: 45px;
  text-align: center;
  margin: 0 auto;
  line-height: 45px;
  color: var(--color-white);
  cursor: pointer;

  label {
    cursor: pointer;
  }
`;
const ButtonContainer = styled.div`
  padding: 24px;
  width: 100%;
`;
const Hint = styled.div`
  margin: 24px auto;
`;
const StyledCanvas = styled.canvas`
  margin: 0 auto;
  border: black 2px solid;
`;

const CreateSignOverlap = ({ canvasRef, handleCreateSign, handleResetSignature }) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 設定線條的相關數值
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // 設置狀態來確認滑鼠 / 手指是否按下或在畫布範圍中
    let isPainting = false;

    // 取得滑鼠 / 手指在畫布上的位置
    function getPaintPosition(e) {
      const canvasSize = canvas.getBoundingClientRect();
      if (e.type === "mousemove") {
        return {
          x: e.offsetX,
          y: e.offsetY,
        };
      } else {
        return {
          x: e.touches[0].clientX - canvasSize.left,
          y: e.touches[0].clientY - canvasSize.top,
        };
      }
    }

    // 開始繪圖時，將狀態開啟
    function startPosition(e) {
      e.preventDefault();
      isPainting = true;
    }

    // 結束繪圖時，將狀態關閉，並產生新路徑
    function finishedPosition() {
      isPainting = false;
      ctx.beginPath();
    }

    // 繪圖過程
    function draw(e) {
      // 滑鼠移動過程中，若非繪圖狀態，則跳出
      if (!isPainting) return;

      // 取得滑鼠 / 手指在畫布上的 x, y 軸位置
      const paintPosition = getPaintPosition(e);
      // 移動滑鼠位置並產生圖案
      ctx.lineTo(paintPosition.x, paintPosition.y);
      ctx.stroke();
    }

    // event listener 電腦板
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mouseleave", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    // event listener 手機板
    canvas.addEventListener("touchstart", startPosition);
    canvas.addEventListener("touchend", finishedPosition);
    canvas.addEventListener("touchcancel", finishedPosition);
    canvas.addEventListener("touchmove", draw);

  }, []);

  const onSave = useCallback(() => {
    const canvas = canvasRef.current;
    const newImg = canvas.toDataURL("image/png");
    // localStorage.setItem('img', newImg);
    handleCreateSign(newImg);
  }, [canvasRef, handleCreateSign]);

  return (
    <Wrapper>
      <Hint>
        請於下方框框簽名
      </Hint>
      <StyledCanvas ref={canvasRef} width={500 > window.outerWidth ? window.outerWidth - 24 : 500} height={300} />

      <ButtonContainer>
        <ButtonWrapper onClick={onSave}>
          創建簽名
        </ButtonWrapper>
      </ButtonContainer>
    </Wrapper>
  );
};

export default CreateSignOverlap;
