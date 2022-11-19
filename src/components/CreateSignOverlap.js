import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: white;
  z-index: 2;
`;

const ResetButtonWrapper = styled.div`
  border-radius: 4px;
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
  position: absolute;
  bottom: 24px;
  padding: 0 24px;
  width: 100%;
`;
const StyledCanvas = styled.canvas`
  position: fixed;
  bottom: 110px;
  left: 50%;
  border: black 2px solid;
  transform: translate(-50%, 10px);
`;

const CreateSignOverlap = ({ handleCreateSign }) => {
  const canvasRef = useRef(null);

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

  // 重新設定畫布
  const onReset = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  const onSave = useCallback(() => {
    const canvas = canvasRef.current;
    const newImg = canvas.toDataURL("image/png");
    localStorage.setItem('img', newImg);
    handleCreateSign(newImg);
  }, [canvasRef]);

  return (
    <Wrapper>
      <StyledCanvas ref={canvasRef} width={500} height={300} />

      <ButtonContainer>
        <ResetButtonWrapper onClick={onReset}>
          清除
        </ResetButtonWrapper>
        <ButtonWrapper onClick={onSave}>
          創建簽名
        </ButtonWrapper>
      </ButtonContainer>
    </Wrapper>
  );
};

export default CreateSignOverlap;
