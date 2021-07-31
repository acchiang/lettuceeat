import React, { useState, useEffect } from "react";
import axios from "axios";
import Theme from "styles/Theme";
import styled from "styled-components";
import Button from "components/Button";
import Input from "components/Input";
import { Title, H2 } from "styles/styleUtils";
import { useHistory } from "react-router-dom";
import lettuce from "assets/lettuce.png";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  padding-top: 100px;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: ${p => p.theme.colors.primary};
`;

const InputContainer = styled.div`
  flex-direction: row;
`;

const SERVER_URL = "http://localhost:9000";

function Welcome({ ...props }) {
  //   useEffect(async () => {
  //     const getSessionName = async () => {
  //       const {
  //         data: { name }
  //       } = await axios.get(
  //         `${SERVER_URL}${localStorage.getItem("sessionPath")}/get-session-name`
  //       );
  //       return name;
  //     };
  //     document.getElementById(
  //       "input-session-name"
  //     ).value = await getSessionName();
  //   }, []);

  const login = async () => {
    window.location.href = "/login";
  };

  const register = async () => {
    window.location.href = "/register";
  };

  const continueAsGuest = async () => {
    window.location.href = "/create-session";
  };

  return (
    <Theme>
      <PageContainer>
        <img id="logo" alt="LettuceEat logo" width="200" src={lettuce} />
        <Title>LettuceEat</Title>
        <H2>Easy bill splitting</H2>
        <Button
          size={"medium"}
          type={"primary"}
          label={"Login"}
          onClick={login}
        />
        <Button
          size={"medium"}
          type={"primary"}
          label={"Register"}
          onClick={register}
        />
        <Button
          size={"medium"}
          type={"primary"}
          label={"Continue as Guest"}
          onClick={continueAsGuest}
        />
      </PageContainer>
    </Theme>
  );
}

export default Welcome;