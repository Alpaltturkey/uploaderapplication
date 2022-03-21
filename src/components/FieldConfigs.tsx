import React from "react";
import {Table, Card, Button, Select, Typography, DatePicker, Tag, Input, InputNumber, Space, Divider, notification, Form, Modal, Switch} from "antd";
import {visualize, updateFieldConfigs, insertFieldConfigs} from '../api/index'
import moment from "moment";
export interface FieldConfigsProps {
}

interface FieldConfigsRow {
    id?: number | undefined,
    field_uid: string | undefined,
    save_tile_inf_files?: number | undefined,
    save_pre_nms_image_infs?: number | undefined,
    save_post_nms_image_infs?: number | undefined,
    trap_face_eol_days?: number | undefined,
    start_date: string | undefined,
    end_date: string | undefined
}

interface FieldRow {
    uid: string,
    gdrive_uid: string,
    gdrive_resync_uuid: string,
    company: number,
    title: string,
    city: string,
    district: string,
    province: string
}

interface FieldSelectProps {
    onChange: (e:string) => void
}

const updateNotification = (field:string | undefined, status : number, type : string) => {
    if(status===200){
        return notification["success"]({
            message: "Successful",
            description:
                `Field ${field} ${type} was successful`
        })
    }
    else{
        return notification["error"]({
            message: "Unsuccessful",
            description:
            `Field ${field} ${type} was unsuccessful`
        })
    }
}

const FieldSelect : React.FunctionComponent<FieldSelectProps> = (props)=>{

    const [fields, setFields] = React.useState([])

    const load = async ()=>{
        const {data = []} = await visualize('fields')
        setFields(data)
    }

    React.useEffect(()=>{
        load();
    },[])

    return <React.Fragment>
        <Select showSearch optionFilterProp={'children'} placeholder="Select Field" style={{width: 400}} onChange={props.onChange}>
            {
                fields.map((x:FieldRow)=><Select.Option key={x.uid} value={x.uid}>{"" + x.title + " - " + x.uid}</Select.Option>)
            }
        </Select>
    </React.Fragment>
}

export const FieldConfigs : React.FunctionComponent<FieldConfigsProps> = (props) => {
    const [source, setSource] = React.useState([]);

    const [isUpdateModalVisible, setUpdateModalVisible] = React.useState(false);

    const [isNewModalVisible, setNewModalVisible] = React.useState(false);

    const [selectedRow, setSelectedRow] = React.useState<FieldConfigsRow>({
        id: undefined,
        field_uid: undefined,
        save_tile_inf_files: undefined,
        save_pre_nms_image_infs: undefined,
        save_post_nms_image_infs: undefined,
        trap_face_eol_days: undefined,
        start_date: undefined,
        end_date: undefined
    })

    const updateEntry = async (row : FieldConfigsRow) => {
        try{
            const {status} = await updateFieldConfigs(row)
            updateNotification(selectedRow.field_uid, status, 'update')
            await load()
        }
        catch(e){
            updateNotification(selectedRow.field_uid, 500, 'update')
        }

    }

    const insertEntry = async (row : FieldConfigsRow) => {
        try{
            const res = await insertFieldConfigs(row)
            let {status} = res
            if(status===201)
                status = 200
            updateNotification(selectedRow.field_uid, status, 'insert')
            await load()
        }
        catch(e){
            updateNotification(selectedRow.field_uid, 500, 'insert')
        }
    }

    const handleUpdateOk = async () => {
        await updateEntry(selectedRow)
        setUpdateModalVisible(false);
      };

    const handleInsertOk = async () => {
        const {field_uid, start_date, end_date} = selectedRow
        await insertEntry({field_uid, start_date, end_date})
        setNewModalVisible(false);
      };


    const load = async ()=>{
            const {data = []} = await visualize('fieldconfigs')
            setSource(data)
    }

    React.useEffect(()=>{
        load();
    },[])

    return <React.Fragment>
        <Space direction={`vertical`} style={{width: '100%'}}>
            <div style={{textAlign: 'left', paddingRight: 7,width: '100%'}} >
                <Button style={{width: 160}} onClick={()=>{setNewModalVisible(true)}}>Add New Config</Button>
            </div>
            <Card style={{ width: "90vw" }}>
                <Table dataSource={source} pagination={{ position: ['bottomCenter'] }} size={`small`} scroll={{y: 'calc(85vh - 90px)', x: 'max-content' }}>
                    <Table.Column dataIndex={'id'} width={"10%"} title={'Field UID'} render={(value, row: FieldConfigsRow, index) => {
                        return <Typography.Text>{row.field_uid}</Typography.Text>
                    }} />
                    <Table.Column dataIndex={'save_tile_inf_files'} width={"10%"} title={'Tile Inf'} render={(value, row: FieldConfigsRow, index) => {
                        return <Tag color={value?"green":"red"}>{value? "TRUE" : "FALSE"}</Tag>
                    }} />
                    <Table.Column dataIndex={'save_pre_nms_image_infs'} width={"10%"} title={'Pre NMS Image'} render={(value, row: FieldConfigsRow, index) => {
                        return <Tag color={value?"green":"red"}>{value? "TRUE" : "FALSE"}</Tag>
                    }} />
                    <Table.Column dataIndex={'save_post_nms_image_infs'} width={"10%"} title={'Post NMS Image'} render={(value, row: FieldConfigsRow, index) => {
                        return <Tag color={value?"green":"red"}>{value? "TRUE" : "FALSE"}</Tag>
                    }} />
                    <Table.Column dataIndex={'id'} width={"10%"} title={'Trap Face EOL Days'} render={(value, row: FieldConfigsRow, index) => {
                        return <Typography.Text>{row.trap_face_eol_days}</Typography.Text>
                    }} />
                    <Table.Column dataIndex={'id'} width={"10%"} title={'Start Date'} render={(value, row: FieldConfigsRow, index) => {
                        return <Typography.Text>{new Date(`${row.start_date}`).toUTCString()}</Typography.Text>
                    }} />
                    <Table.Column dataIndex={'id'} width={"10%"} title={'End Date'} render={(value, row: FieldConfigsRow, index) => {
                        return <Typography.Text>{new Date(`${row.end_date}`).toUTCString()}</Typography.Text>
                    }} />
                    <Table.Column dataIndex={'id'} title={''} render={(value, row: FieldConfigsRow, index) => {
                        return <Button type="primary" onClick={()=>{
                                    setSelectedRow(row)
                                    setUpdateModalVisible(true)
                                }}>
                                Update Config
                            </Button>
                    }} />
                    
                </Table>
            </Card>
        </Space>

        {`${isUpdateModalVisible}` && <Modal key={`${isUpdateModalVisible}`} title={"Update field " + selectedRow.field_uid} visible={isUpdateModalVisible} onOk={handleUpdateOk} onCancel={()=>{setUpdateModalVisible(false)}}>
            <Form>
                <Form.Item name="save_tile_inf_files" label="Tile Inf">
                    <Switch checked={selectedRow.save_tile_inf_files ? true : false} onChange={(e)=>{setSelectedRow({...selectedRow, save_tile_inf_files: e ? 1 : 0})}}></Switch>
                </Form.Item>
                <Form.Item name="save_pre_nms_image_infs" label="Pre NMS Image">
                    <Switch checked={selectedRow.save_pre_nms_image_infs ? true : false} onChange={(e)=>{setSelectedRow({...selectedRow, save_pre_nms_image_infs: e ? 1 : 0})}}></Switch>
                </Form.Item>
                <Form.Item name="save_post_nms_image_infs" label="Post NMS Image">
                    <Switch checked={selectedRow.save_post_nms_image_infs ? true : false} onChange={(e)=>{setSelectedRow({...selectedRow, save_post_nms_image_infs: e ? 1 : 0})}}></Switch>
                </Form.Item>
                <Form.Item name="trap_face_eol_days" label="Trap Face EOL Days">
                    <InputNumber defaultValue={selectedRow.trap_face_eol_days} onChange={(e)=>{setSelectedRow({...selectedRow, trap_face_eol_days:e})}}/>
                </Form.Item>
                <Form.Item name="start_end" label="Start Date">
                    <DatePicker showTime defaultValue={moment(selectedRow.start_date)} onChange={(e)=>{setSelectedRow({...selectedRow, start_date:e?.toDate().toISOString()})}} />
                </Form.Item>
                <Form.Item name="end_end" label="End Date">
                    <DatePicker showTime defaultValue={moment(selectedRow.end_date)} onChange={(e)=>{setSelectedRow({...selectedRow, end_date:e?.toDate().toISOString()})}} />
                </Form.Item>
            </Form>
        </Modal>}

        {`${isNewModalVisible}` && <Modal key={`${isNewModalVisible}`} title={"Add new config "} visible={isNewModalVisible} onOk={handleInsertOk} onCancel={()=>{setNewModalVisible(false)}}>
            <Form>
                <Form.Item name="field_uid" label="Field UID">
                    <FieldSelect onChange={(e)=>{setSelectedRow({...selectedRow, field_uid:e })}}></FieldSelect>
                </Form.Item>
                <Form.Item name="start_end" label="Start Date">
                    <DatePicker showTime onChange={(e)=>{setSelectedRow({...selectedRow, start_date:e?.toDate().toISOString()})}} />
                </Form.Item>
                <Form.Item name="end_end" label="End Date">
                    <DatePicker showTime onChange={(e)=>{setSelectedRow({...selectedRow, end_date:e?.toDate().toISOString()})}} />
                </Form.Item>
            </Form>
        </Modal>}

    </React.Fragment>
}
