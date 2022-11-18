import React from "react";
import styled from "styled-components";
import loading_bar from "../assets/loading_bar.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  img {
    width: 160px;
  }
`;

const Loading = () => {
  return (
    <Wrapper>
      <p>簽署文件載入中...</p>
      <img src={loading_bar} alt="loading bar" />
    </Wrapper>
  );
};

export default Loading;
