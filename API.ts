import { config } from "./config.ts";

const API = async(data: {user: string, module: string, version: string, extra?: string}) => {

    let url = `${config.api}~${data.user}/${data.module}`;
    if(data.version)
        url = `${url}@${data.version}`;
    if(data.extra)
        url = `${url}/${data.extra}` ;

    try {
        const res = await fetch(url);
        return await res.json();
    } catch(e) {
        // console.log(e);
    }

    return;
}


export default API;