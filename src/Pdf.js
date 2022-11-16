import styled from "styled-components";
import { ReactComponent as Signature_icon } from "./assets/Signature_icon.svg";
import Button from "./components/Button";
import Circle from "./components/Circle";

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 36px;
  margin: 50px 60px;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Pdf = () => {
  return (
    <>
      <Wrapper>
        <Signature_icon />
        <StepsContainer>
          <Step>
            <Circle number={1} />
            上傳檔案
          </Step>
          <Step>
            <Circle number={2} />
            簽署
          </Step>
          <Step>
            <Circle number={3} />
            下載檔案
          </Step>
        </StepsContainer>
      </Wrapper>
      {/* <Button /> */}
    </>
  );
};

export default Pdf;
