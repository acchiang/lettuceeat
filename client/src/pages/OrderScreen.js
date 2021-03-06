/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Theme from "styles/Theme";
import { OrderContext } from "utils/Context";
import Button from "components/Button";
import MenuSelector from "components/MenuSelector";
import DollarAmount from "components/DollarAmount";
import TipAmount from "components/TipAmount";
import TotalAmount from "components/TotalAmount";
import styled from "styled-components";
import TextIcon from "components/TextIcon";
import TopTitleBar from "components/TopTitleBar";

import { useTranslation } from "react-i18next";

const DEFAULT_MENU_ID = "6103677a11c316178047f1f1";

const PageContainer = styled.div`
  width: 100%;
  background: ${p => p.theme.colors.primary};
  overflow: hidden;
`;

const PanelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 20px;
  flex-direction: row;
  ${p => p.theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: center;
  }
`;

const Panel = styled.div`
  width: 400px;
  vertical-align: top;
  ${p => p.theme.mediaQueries.mobile} {
    width: 70vw;
  }
`;

const DividerPanel = styled.div`
  vertical-align: top;
  ${p => p.theme.mediaQueries.mobile} {
    display: none;
  }
`;

const Divider = styled.div`
  height: 90vh;
  width: 1px;
  background-color: ${p => p.theme.colors.text};
  margin-left: 50px;
  margin-right: 50px;
`;

const SubtotalContainer = styled.div`
  text-align: right;
`;

const IconsContainer = styled.div``;

const FinalOrderContainer = styled.div`
  text-align: center;
`;

const tipOptions = ["10%", "15%", "20%", "Other"];
const StyledHeader = styled.h2`
  color: ${p => p.theme.colors.text};
  ${p => p.theme.mediaQueries.mobile} {
    font-size: ${p => p.theme.fontSizes.small};
  }
`;

function OrderScreen() {
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [tipPercent, setTipPercent] = useState(tipOptions[0]);
  const [showInput, setShowInput] = useState(false);
  const [sessionName, setSessionName] = useState(t("title"));
  const [sessionId, setSessionId] = useState("");
  const [sessionUser, setSessionUser] = useState(null);
  const [sessionUsers, setSessionUsers] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [sessionMenuTotal, setSessionMenuTotal] = useState(0);
  const [sessionTipTotal, setSessionTipTotal] = useState(0);
  const history = useHistory();

  const fetchSessionData = async () => {
    return axios.get(
      `/api/sessions/${localStorage.getItem("sessionId")}/order-screen`
    );
  };

  const fetchMenu = async menuId => {
    return axios.get(`/api/menus/${menuId}`);
  };

  const fetchMenuTotalByUser = async () => {
    return await axios.get(
      `/api/sessions/${localStorage.getItem("sessionId")}/${
        sessionUser.name
      }/get-user-menu-total`
    );
  };

  const fetchTipTotalByUser = async () => {
    return await axios.get(
      `/api/sessions/${localStorage.getItem("sessionId")}/${
        sessionUser.name
      }/get-user-tip-total`
    );
  };

  const fetchSessionMenuTotalSoFar = async () => {
    return await axios.get(
      `/api/sessions/${localStorage.getItem("sessionId")}/get-session-menu-total`
    );
  };

  const fetchSessionTipTotalSoFar = async () => {
    return await axios.get(
      `/api/sessions/${localStorage.getItem("sessionId")}/get-session-tip-total`
    );
  };

  const updateMenuTotalSoFar = async subtotal => {
    return await axios.put(
      `/api/sessions/${sessionId}/update_menu_total`,
      { menuTotalSoFar: subtotal }
    );
  };

  const updateTipTotalSoFar = async tipTotal => {
    return await axios.put(
      `/api/sessions/${sessionId}/update_tip_total`,
      { tipTotalSoFar: tipTotal }
    );
  };

  const updateUserMenuTotal = async userMenuTotal => {
    return await axios.put(
      `/api/sessions/${sessionId}/update_user_menu_total`,
      { sessionUser, userMenuTotal }
    );
  };

  const updateUserTipTotal = async userTipTotal => {
    return await axios.put(
      `/api/sessions/${sessionId}/update_user_tip_total`,
      { sessionUser, userTipTotal }
    );
  };

  const initializeMenu = async () => {
    const {
      data: { items: menu }
    } = await fetchMenu(selectedMenuId || DEFAULT_MENU_ID);
    return menu.map(item => ({ item, quantity: 0 }));
  };

  const consolidateOrder = async () => {
    history.push({
      pathname: "/final-order",
      state: {
        sessionName: sessionName,
        sessionId: sessionId,
        users: sessionUsers,
        menu: await initializeMenu(),
        menuTotal: sessionMenuTotal,
        tipTotal: sessionTipTotal
      }
    });
  };

  const refresh = async () => {
    let menuTotalInDBSoFar = (await fetchSessionMenuTotalSoFar()).data
      .menuTotalSoFar;
    let tipTotalInDBSoFar = (await fetchSessionTipTotalSoFar()).data
      .tipTotalSoFar;
    if (menuTotalInDBSoFar === null) {
      menuTotalInDBSoFar = 0;
    }
    if (tipTotalInDBSoFar === null) {
      tipTotalInDBSoFar = 0;
    }
    setSessionMenuTotal(menuTotalInDBSoFar.toFixed(2));
    setSessionTipTotal(tipTotalInDBSoFar.toFixed(2));
    const {
      data: { users }
    } = await fetchSessionData();
    setSessionUsers(users);
  };

  const findOrUpdateOrder = async order => {
    return await axios.put(
      `/api/sessions/${sessionId}/update_order`,
      { sessionUser, order }
    );
  };

  const updateQuantity = (name, quantity) => {
    const updatedOrder = order;
    const idx = order.findIndex(({ item }) => item.name === name);
    if (updatedOrder[idx].quantity !== quantity) {
      updatedOrder[idx].quantity = quantity;
      setOrder(updatedOrder);
      findOrUpdateOrder(updatedOrder);
      setSubtotal(
        updatedOrder.reduce((total, i) => total + i.item.price * i.quantity, 0)
      );
    }
  };

  const updateUserMenuAndTipInDB = async () => {
    // get the user menu and tip total
    let userMenuTotalSoFar = (await fetchMenuTotalByUser()).data;
    let userTipTotalSoFar = (await fetchTipTotalByUser()).data;
    // subtract user menu and tip total from session menu and tip total
    let menuTotalInDBSoFar = (await fetchSessionMenuTotalSoFar()).data
      .menuTotalSoFar;
    let tipTotalInDBSoFar = (await fetchSessionTipTotalSoFar()).data
      .tipTotalSoFar;
    if (menuTotalInDBSoFar === null) {
      menuTotalInDBSoFar = 0;
    }
    if (tipTotalInDBSoFar === null) {
      tipTotalInDBSoFar = 0;
    }
    let subtractedMenuTotal = menuTotalInDBSoFar - userMenuTotalSoFar;
    if (subtractedMenuTotal < 0) {
      subtractedMenuTotal = 0;
    }
    let subtractedTipTotal = tipTotalInDBSoFar - userTipTotalSoFar;
    if (subtractedTipTotal < 0) {
      subtractedTipTotal = 0;
    }
    await updateMenuTotalSoFar(subtractedMenuTotal);
    await updateTipTotalSoFar(subtractedTipTotal);
    // update user menu and tip total to new numbers
    await updateUserMenuTotal(subtotal);
    let tipTotal = subtotal * 0.01 * tipPercent.replace(/\D/g, "");
    await updateUserTipTotal(tipTotal);
    // add new user menu and tip totals to session menu and tip totals
    let updatedMenuTotalInDBSoFar = (await fetchSessionMenuTotalSoFar()).data
      .menuTotalSoFar;
    let updatedTipTotalInDBSoFar = (await fetchSessionTipTotalSoFar()).data
      .tipTotalSoFar;
    let addedMenuTotal = updatedMenuTotalInDBSoFar + subtotal;
    let addedTipTotal = updatedTipTotalInDBSoFar + tipTotal;
    await updateMenuTotalSoFar(addedMenuTotal);
    await updateTipTotalSoFar(addedTipTotal);
    // update react frontend with new group total numbers
    await setSessionMenuTotal(addedMenuTotal);
    await setSessionTipTotal(addedTipTotal.toFixed(2));
  };

  const handleTipChange = updatedTipPercent => {
    localStorage.setItem("tipPercent", updatedTipPercent);
    setTipPercent(updatedTipPercent);
  };

  useEffect(async () => {
    refresh();
  }, []);

  useEffect(async () => {
    const {
      data: { name, _id, users, menuId }
    } = await fetchSessionData();
    setSessionId(_id);
    setSessionName(name);
    setSessionUsers(users);
    setSelectedMenuId(menuId);
    setSessionUser(JSON.parse(localStorage.getItem("user")));
    setTipPercent(localStorage.getItem("tipPercent") || tipOptions[0]);
  }, []);

  useEffect(async () => {
    const initializeOrder = async () => {
      const { data } = await findOrUpdateOrder(null);
      if (data && !data.length) {
        const {
          data: { items: latestMenu }
        } = await fetchMenu(selectedMenuId || DEFAULT_MENU_ID);
        return latestMenu.map(item => ({ item, quantity: 0 }));
      }
      setSubtotal(
        data.reduce((total, i) => total + i.item.price * i.quantity, 0)
      );
      return data;
    };
    if (sessionUser && sessionId) {
      setOrder(await initializeOrder());
    }
  }, [sessionUser, sessionId]);

  return (
    <Theme>
      <OrderContext.Provider value={[order, setOrder]}>
        <PageContainer>
          <TopTitleBar
            title={sessionName}
            setTitle={setSessionName}
            backUrl={"/create-session"}
            copyUrl={`${window.location.host}/sessions/${localStorage.getItem(
              "sessionId"
            )}`}
            sessionId={sessionId}
          />
          <PanelContainer>
            <Panel>
              <StyledHeader>{t("menu")}</StyledHeader>
              <MenuSelector order={order} updateQuantity={updateQuantity} />
              <SubtotalContainer>
                <DollarAmount
                  size={"medium"}
                  label={t("subtotal")}
                  amount={subtotal.toFixed(2)}
                />
                <TipAmount
                  value={tipPercent}
                  size={"medium"}
                  label={t("tip")}
                  options={tipOptions}
                  showInput={showInput}
                  setShowInput={setShowInput}
                  feedValueToParent={handleTipChange}
                />
                <DollarAmount
                  size={"medium"}
                  label={t("order-total")}
                  amount={(
                    subtotal +
                    subtotal * 0.01 * tipPercent.replace(/\D/g, "")
                  ).toFixed(2)}
                />
                <Button
                  size={"medium"}
                  type={"primary"}
                  label={t("confirm-order")}
                  onClick={() => updateUserMenuAndTipInDB()}
                />
              </SubtotalContainer>
            </Panel>
            <DividerPanel>
              <Divider />
            </DividerPanel>
            <Panel>
              <StyledHeader>{t("users")}</StyledHeader>
              <IconsContainer>
                {sessionUsers.map(u => (
                  <TextIcon
                    key={u.name + u.date}
                    textLetter={u.name?.charAt(0).toUpperCase()}
                    size={"default"}
                    color={"#31B4DB"}
                  >
                    {u.name}
                  </TextIcon>
                ))}
              </IconsContainer>
              <FinalOrderContainer>
                <StyledHeader>{t("group-total")}</StyledHeader>
                <TotalAmount
                  size={"medium"}
                  menuAmount={sessionMenuTotal}
                  tipAmount={sessionTipTotal}
                />
                <Button
                  size={"medium"}
                  type={"primary"}
                  label={t("consolidate")}
                  onClick={() => consolidateOrder()}
                />
                <Button
                  size={"medium"}
                  type={"primary"}
                  label={t("refresh")}
                  onClick={() => refresh()}
                />
              </FinalOrderContainer>
            </Panel>
          </PanelContainer>
        </PageContainer>
      </OrderContext.Provider>
    </Theme>
  );
}

export default OrderScreen;
