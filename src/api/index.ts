import axios from "axios"
import moment from "moment";

if(process.env.REACT_APP_SERVER_URL){
    axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
}

axios.interceptors.request.use((cfg)=>{
    return cfg;
})

axios.interceptors.response.use((cfg)=>{
    return cfg;
})

export const visualize = async (tableName:string)=>{
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: 'spectre',
            password: 'spectre'
        }
    }
    return await axios.get(`/api/${tableName}/`, options)
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


export const updateFieldConfigs = async (data: FieldConfigsRow)=>{
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: 'spectre',
            password: 'spectre'
        }
    }

    return await axios.put(`/api/fieldconfigs/${data.id}/`, data, options)
}

export const insertFieldConfigs = async (data: FieldConfigsRow)=>{
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: 'spectre',
            password: 'spectre'
        }
    }

    return await axios.post(`/api/fieldconfigs/`, data, options)
}

