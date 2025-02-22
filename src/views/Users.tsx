import React, {useEffect, useState} from 'react';

import {Col, Row, Tabs, TabsProps} from "antd";
import {Container} from "../components/Container";
import {actions as userActions} from "../store/user";
import {useGetTokenSilently} from "../utils/token";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "typesafe-actions";
import RegularUsers from "./RegularUsers";
import ServiceUsers from "./ServiceUsers";
import UserEdit from "../components/UserEdit";

export const Users = () => {
    const {getTokenSilently} = useGetTokenSilently()
    const dispatch = useDispatch()

    const [isAdmin, setIsAdmin] = useState(false);
    const users = useSelector((state: RootState) => state.user.data)
    const user = useSelector((state: RootState) => state.user.user)
    const tab = useSelector((state: RootState) => state.user.userTabOpen)

      const editUserPopupVisible = useSelector(
        (state: RootState) => state.user.editUserPopupVisible
      );
    
    
    const userItems: TabsProps['items'] = [
        {
            key: 'Users',
            label: 'Users',
            children: <RegularUsers/>,
        },
    ]

    const adminOnlyItems: TabsProps['items'] = [
        {
            key: 'Service Users',
            label: 'Service Users',
            children: <ServiceUsers/>,
        },
    ]

    const [tabItems, setTabItems] = useState(userItems);

    useEffect(() => {
        if (isAdmin) {
            setTabItems(userItems.concat(adminOnlyItems));
        }
    }, [isAdmin])

    useEffect(() => {
        if(users) {
            let currentUser = users.find((user) => user.is_current)
            if(currentUser) {
                setIsAdmin(currentUser.role === 'admin');
            }
        }
    }, [users])

    useEffect(() => {
        dispatch(userActions.getUsers.request({getAccessTokenSilently: getTokenSilently, payload: null}))
    }, [])

    const onTabClick = (key:string) => {
        dispatch(userActions.setUserTabOpen(key))
    }

    return (
      <>
        <Container style={{ paddingTop: "40px" }}>
          {!editUserPopupVisible && (
            <Row>
              <Col span={24}>
                <Tabs
                  defaultActiveKey={tab}
                  items={tabItems}
                  onTabClick={onTabClick}
                  animated={{ inkBar: true, tabPane: false }}
                  tabPosition="top"
                  // destroyInactiveTabPane={true}
                />
              </Col>
            </Row>
          )}
          {editUserPopupVisible && <UserEdit />}
        </Container>
      </>
    );
}

export default Users;