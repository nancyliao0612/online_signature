import styled from "styled-components";
import { BsPen, BsCheck, BsX } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";

const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14.5px 16px;
  box-shadow: 0px 0px 8px 0px #00000040;
  color: var(--color-primary);
  font-weight: 600;

  .icon {
    font-size: 24px;
    cursor: pointer;
  }

  .signup {
    margin: 0 auto;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Navbar = ({ hasPDF, setOpen }) => {
  return (
    <Wrapper>
      {hasPDF ? (
        <>
          <BsX className="icon" onClick={() => setOpen(true)} />
          簽個名
          <IconContainer>
            <BsPen />
            <BsCheck className="icon" />
          </IconContainer>
        </>
      ) : (
        <>
          <div className="signup">簽個名</div>
        </>
      )}
    </Wrapper>
  );
};

export default Navbar;
