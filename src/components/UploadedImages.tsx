import React from "react";
import { Table, Card, Button, Select, Typography, DatePicker, Tag, Input, InputNumber, Space, Divider, notification, Form, Modal, Switch, Steps } from "antd";
import { visualize } from '../api/index'
import { UploadOutlined } from '@ant-design/icons';
import {ImageStage} from '../utils/utils'

const { Step } = Steps;

interface UploadedImagesProps {
}

interface ImagesRow {
    username: string,
    gdrive_filename: string,
    gdrive_uid: string,
    gdrive_modified_time: string,
    field_uid: string,
    trap_uid: string,
    images_path: string,
    stage: string,
    status: string,
    start_date: string,
    end_date: string,
    downloaded_at: string,
    is_enlarged: number,
    is_enlarged_by_sres: number,
    set_inf_cmd_id: number,
    used_inf_cmd_id: number,
    to_delete: number
}

export const UploadedImages: React.FunctionComponent<UploadedImagesProps> = (props) => {

    const [source, setSource] = React.useState([]);
    const load = async () => {
        const { data = [] } = await visualize('images')
        setSource(data)
    }


    const getStage = (props) => {
        let stage = ImageStage[props.stage]
        let status : "error" | "finish" | "process" = (props.status === 'failed' ? "error" : props.status === 'done' ? "finish" : "process")
        return <Steps current={stage - 1} status={status}>
        <Step title="1" description="Image Downloader" />
        <Step title="2" description="Exif Extractor" />
        <Step title="3" description="Basic Classifier" />
        <Step title="4" description="QR Extractor" />
        <Step title="5" description="Super Res" />
        <Step title="6" description="Tiler" />
        <Step title="7" description="Tile Inferencer" />
        <Step title="8" description="NMS" />
      </Steps>
    }



    React.useEffect(() => {
        load();
    }, [])


    return <React.Fragment>
        <Space direction={`vertical`} style={{ width: '100%' }}>
            <Card style={{ width: "120vw" }}>
                <Table dataSource={source} pagination={{ position: ['bottomCenter'] }} size={`small`} scroll={{ y: 'calc(85vh - 90px)', x: 'max-content' }}>
                    <Table.Column dataIndex={'id'} width={"10%"} title={'Username'} render={(value, row: ImagesRow, index) => {
                        return <Typography.Text>{row.username}</Typography.Text>
                    }} />
                    <Table.Column dataIndex={'id'} width={"10%"} title={'Filename'} render={(value, row: ImagesRow, index) => {
                        return <Typography.Text>{row.gdrive_filename}</Typography.Text>
                    }} />
                    <Table.Column dataIndex={'id'} width={"10%"} title={'GDrive Modified'} render={(value, row: ImagesRow, index) => {
                        return <Typography.Text>{new Date(`${row.gdrive_modified_time}`).toUTCString()}</Typography.Text>
                    }} />
                    <Table.Column dataIndex={'id'} width={"70%"} title={'Stage'} render={(value, row: ImagesRow, index) => {
                        return getStage({stage : row.stage, status : row.status } )
                    }} />


                </Table>
            </Card>
        </Space>
    </React.Fragment>
}