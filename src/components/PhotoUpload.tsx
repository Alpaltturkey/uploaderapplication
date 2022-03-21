import React from "react";
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { file } from "googleapis/build/src/apis/file";
// const FormData = require('form-data');

/*

{
  name: "location-black-png-10.png",
  size: 7859,
  type: "image/png",
  uid: "rc-upload-1636132906101-3",
  webkitRelativePath: "tempdir/location-black-png-10.png"
}

*/

const axios = require('axios')

const DB_HOST = '159.65.182.234'
const DB_PORT = 5432
const DB_USER = 'alper'
const DB_PASS = 'ash37#1298'
const DB_DB = 'agriturkey'


const CLIENT_ID = '192006771391-k8upntqh0unecsk495ea15tgmfejsvfc.apps.googleusercontent.com'
const CLIENT_SECRET = '6RW1LgqHVjfVhKJCCHw8lMxg'
const API_KEY = 'AIzaSyBgvRfagG78Er4VHp_EM-mQgcScfrlY0PY'
const REDIRECT_URl = 'http://zentuari.io'
// const REDIRECT_URl = 'http://localhost:3000'

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file';

const PARENT_FOLDER = '1YyT4oMwIic4YULSQzNi1jtRctBJmMo8C'

const getExtension = (str: string) => { return str.slice(str.lastIndexOf(".")) };

const checkIfJPG = (filename: string) => {
  let extension = getExtension(filename)
  switch (extension) {
    case '.jpg':
    case '.jpeg': {
      return true
    }
    default: {
      return false
    }
  }
}

interface DriveFileListelementProps{
  name : string
}

const checkIfExists = (filename: string, imageList: DriveFileListelementProps[]) => {
  if (imageList.find(element => element.name === filename)) {
    return true
  }
  return false
}


interface PhotoUploadProps {
}

export const PhotoUpload: React.FunctionComponent<PhotoUploadProps> = (props) => {

  const [token, setToken] = React.useState('')
  const [folderID, setFolderID] = React.useState('')

  const [imageList, setImageList] = React.useState([])

  const getCurrentUTCDateFolderTitle = async () => {
    const { data: { datetime } } = await axios.get('http://worldtimeapi.org/api/timezone/Etc/UTC')
    return datetime.toString().substring(0, 10)
  }

  const isDayFolderAvailable = async (folder_title, token) => {
    const url = `https://www.googleapis.com/drive/v2/files/${PARENT_FOLDER}/children?access_token=${token}`
    const { data } = await axios.get(url);
    const items = data.items || []
    if (items.length > 0) {
      const res = await axios.get(`https://www.googleapis.com/drive/v2/files/${items[0].id}?access_token=${token}`);
      if (folder_title == res.data.title) {
        return { exists: true, folder_id: items[0].id }
      }
      return { exists: false }
    }
    return { exists: false }
  }

  const createFolder = async (folder_title, token) => {
    const url = `https://www.googleapis.com/drive/v3/files?access_token=${token}`
    const body = { "name": folder_title, "mimeType": "application/vnd.google-apps.folder", "parents": [PARENT_FOLDER] }
    return await axios.post(url, body);
  }

  const getDailyFolderID = async (token) => {
    const folder_title = await getCurrentUTCDateFolderTitle();
    const is_folder_available = await isDayFolderAvailable(folder_title, token)
    if (is_folder_available.exists) {
      return is_folder_available.folder_id
    }

    const { data } = await createFolder(folder_title, token)
    return data.id
  }

  const getImageList = async (token) => {
    const url = `https://www.googleapis.com/drive/v3/files?access_token=${token}`;
    const {data} = await axios.get(url);
    console.log('XXXXXXXXXXXXXXXXXXX_LINE_115')
    console.log(data)
    return (data || {}).files || []
  }

  const config = {
    name: 'file',
    action: `https://www.googleapis.com/upload/drive/v3/files?access_token`,
    headers: {
    },
    customRequest: (options: any) => {

      const data = new FormData()
      //BEGIN----------------------------------------CHECK-FOR-DUPLICATE-------------------------------------------------------------

      if (checkIfJPG(options.file.name)) {
        if (!checkIfExists(options.file.name, imageList)) {



          const filemeta = { name: options.file.name, mimeType: 'image/png', parents: [folderID] }
          //@ts-ignore



          data.append('Metadata', new Blob([JSON.stringify(filemeta)], { type: "application/json" }));

          //@ts-ignore
          data.append('Media', options.file);

          //END--------------------------------------------------------------------------------------------------------------------------

          const config = {
            "headers": {
              "content-type": `multipart/related; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`
            }
          }

          // const token = "ya29.a0ARrdaM-ujVPGHycoXfn5LY-N2uRUmxNcbiYy_7CNwDzOY0ujagrNoWTYvxXbCGowd0tjl2afx28zyH-Cuje6wSukReyw1z_8CFGao5Sra9LWQV5oe6LmAh158Zy20LdVmeMDNfxiK_X6S0usXKMjEx5ynQe1"

          const url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${token}`
          axios.post(url, data, config).then((res: any) => {
            options.onSuccess(res.data, options.file)
          }).catch((err: Error) => {
            console.log(err)
          })

        }

        else {
          message.error(`${options.file.name} file upload failed. File already exists`);
          options.onError({ event: new Error('Duplicate upload') })
        }
      }
      else {
        message.error(`${options.file.name} file upload failed. Only .jpg/.jpeg are allowed`);
        options.onError({ event: new Error('Only JPG are allowed') })
      }


    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return <React.Fragment>
    <Button onClick={() => {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Fzentuari.io&prompt=consent&response_type=code&client_id=${CLIENT_ID}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&access_type=offline`
      // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A3000&prompt=consent&response_type=code&client_id=${CLIENT_ID}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&access_type=offline`
      return true
    }}>Get Token</Button>
    <Button onClick={async () => {

      const code = localStorage.getItem("code")

      if (code) {

        const res = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          redirect_uri: REDIRECT_URl,
          grant_type: 'authorization_code'
        })

        const { data: { access_token } } = res

        setToken(access_token);

        const folder_ID = await getDailyFolderID(access_token);

        setFolderID(folder_ID);

        const driveFileList = await getImageList(access_token);

        console.log('XXXXXXXXXXXXXXXXXXXXXXX____LINE_216')

        setImageList(driveFileList);

        console.log(driveFileList)
        console.log(imageList)


      }

    }} disabled={localStorage.getItem("code") == null}>LOAD Token</Button>
    <Upload {...config} directory>
      <Button disabled={token === ''} icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  </React.Fragment>
}
