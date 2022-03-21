import React from "react";
import { useLocation } from 'react-router-dom'
import { Route, useHistory } from "react-router-dom";
import { Drawer, Grid, Layout, Button, Dropdown, Card, Menu, Avatar, Space, Badge } from 'antd'
import {
    MenuOutlined,
    AccountBookOutlined,
    ProfileOutlined,
    BookOutlined
} from '@ant-design/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import "react-perfect-scrollbar/dist/css/styles.css";
import fullImage from '../assets/img.png'
import compactImage from '../assets/img 900x900.png'
import { FieldConfigs } from "../components/FieldConfigs"
import { PhotoUpload } from "../components/PhotoUpload"
import { UploadedImages} from "../components/UploadedImages"
import qs from 'query-string'
import { connect } from "http2";

export interface ViewPortContextProps {
    isMobileView?: boolean
}

export interface ResponsiveMenuContextProps {
    collapsed?: boolean
    setCollapsed: (data: boolean) => void
}

export const ViewPortContext = React.createContext<ViewPortContextProps>({ isMobileView: false })
export const ResponsiveMenuContext = React.createContext<ResponsiveMenuContextProps | undefined>(undefined)

export const ResponsiveMenu: React.FunctionComponent = (props) => {

    return <ViewPortContext.Consumer>
        {
            view => <ResponsiveMenuContext.Consumer>
                {
                    state => <React.Fragment>

                        {!view.isMobileView && state && <Layout.Sider theme={"light"} style={{ borderRight: "1px solid #e4e9f0" }} collapsed={state.collapsed}
                            onCollapse={state.setCollapsed}>
                            {props.children}
                        </Layout.Sider>}
                        {view.isMobileView && state &&
                            <Drawer bodyStyle={{ padding: 0 }} visible={!state.collapsed} onClose={() => state.setCollapsed(true)} title={"App Menu"} placement={"left"}>
                                {props.children}
                            </Drawer>}
                    </React.Fragment>
                }
            </ResponsiveMenuContext.Consumer>
        }
    </ViewPortContext.Consumer>
}



export const MainView: React.FunctionComponent = (props) => {

    const [collapsed, setCollapsed] = React.useState(false)
    const [view, setView] = React.useState("#dashboard")
    const { md } = Grid.useBreakpoint()

    const history = useHistory()

    let location = useLocation();
    const getCode = () => {
        const { code = "" } = qs.parse(location.search); 
         //@ts-ignore

        if(code!==""){
                     //@ts-ignore    
            localStorage.setItem('code', code)
        }    
    }

    // getCode()

    React.useEffect(()=>{
        getCode()
    })








    const account = React.useMemo(() => <Card
        headStyle={{ padding: 12, textAlign: "center", borderBottom: "1px solid #e4e9f0" }} bodyStyle={{ padding: 0 }}
        title={"User 1"}>
        <Menu>
            <Menu.Item icon={<ProfileOutlined />}>Profile</Menu.Item>
        </Menu>
    </Card>, [])

    const menus = React.useMemo(() => <React.Fragment>
        <Menu.Item key={"/field-configs"} icon={<BookOutlined size={75} />}>Field Configs</Menu.Item>
        <Menu.Item key={"/photo-upload"} icon={<BookOutlined size={75} />}>Photo Upload</Menu.Item>
        <Menu.Item key={"/uploaded-images"} icon={<BookOutlined size={75} />}>Uploaded Images</Menu.Item>
    </React.Fragment>, [])


    return <React.Fragment>
        <ViewPortContext.Provider value={{ isMobileView: !md }}>
            <Layout style={{ height: '100%' }}>

                <ResponsiveMenuContext.Provider value={{ collapsed, setCollapsed }}>
                    <ResponsiveMenu>
                        {md && <div className={"ant-layout-header"} style={{ backgroundColor: "transparent", padding: 0 }}>
                            <img src={collapsed ? compactImage : fullImage} className={"ant-layout-header"}
                                style={{ backgroundColor: "transparent", padding: 0 }} alt={"logo"} />
                        </div>}

                        <div className={'scroll-panel'} style={{ height: 'calc(100% - 64px)' }}>
                            <PerfectScrollbar component={"div"} options={{ swipeEasing: true, wheelSpeed: 0.25 }}>
                                <Menu
                                    mode={"inline"}
                                    onSelect={(e) => {
                                        history.push(e.key)
                                        setView(e.key)
                                    }}
                                    selectedKeys={[view]}
                                    defaultOpenKeys={["orders-menu", "invoices-menu", "reports-menu"]}
                                >
                                    {menus}
                                </Menu>
                            </PerfectScrollbar>
                        </div>
                    </ResponsiveMenu>
                </ResponsiveMenuContext.Provider>
                <Layout>
                    <Layout.Header style={{
                        backgroundColor: "white",
                        borderBottom: "1px solid #e4e9f0",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 16
                    }}>
                        <Button className={"custom-text-btn"} size={"large"} icon={<MenuOutlined size={75} />}
                            type={"link"} onClick={() => setCollapsed(!collapsed)} />

                        {/* {md && <Menu mode={"horizontal"} onSelect={(e)=>{
                            history.push(e.key)
                            setView(e.key)
                            }} selectedKeys={[view]}>{menus}</Menu>} */}
                        <div style={{ flexGrow: 1, height: '100%' }} />
                        <Menu mode={"horizontal"}>
                            <Menu.SubMenu title={<Avatar>AA</Avatar>}>
                                <Menu.Item>Sign Out</Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    </Layout.Header>
                    <Layout.Content style={{ backgroundColor: "white", padding: 12 }} className={'scroll-panel'}>
                        <Route path="/field-configs">
                            <FieldConfigs />
                        </Route>
                        <Route path="/photo-upload">
                            <PhotoUpload/>
                        </Route>
                        <Route path="/uploaded-images">
                            <UploadedImages/>
                        </Route>
                    </Layout.Content>
                    <Layout.Footer style={{ backgroundColor: "white", borderTop: "1px solid #e4e9f0" }}>

                    </Layout.Footer>
                </Layout>
            </Layout>
        </ViewPortContext.Provider>
    </React.Fragment>
}
