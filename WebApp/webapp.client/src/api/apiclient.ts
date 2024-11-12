import { ServerResponse, ValidationResult } from '../classes/resultClasses'
import axios, { AxiosError, AxiosResponse } from "axios";



export async function postToUrlAxios(input: any, url: string) {
    
    const headers:any = {
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.post(url, input, {
            method: 'POST',
            headers: headers,
        });

        const resData = await getDataFromAxiosResponse({ response });
        return resData;
    } catch (e) {
        return getDataFromAxiosError(e as AxiosError);
    }
}

export async function getFromUrlAxios(url: string, params?: URLSearchParams) {
    const headers:any = {
        'Content-Type': 'application/json',
    }
    try {
        url = params ? url + "?" + params.toString() : url
        const response = await axios.get(url, {
            headers:headers
        });

        const resData = await getDataFromAxiosResponse({ response });
        return resData;
    } catch (e) {
        return getDataFromAxiosError(e as AxiosError);
    }
}

export async function getFileAxios(input: any, url: string) {
    
    const headers:any = {
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.post(url, input, {
            method: 'POST',
            responseType: 'blob',
            headers: headers
        });

        const resData = await getDataFromAxiosResponse({ response });
        return resData;
    } catch (e) {
        return getDataFromAxiosError(e as AxiosError);
    }

}

export async function getDataFromAxiosError(error: AxiosError) {
    const response = new ServerResponse();
    response.success = false;
    if (error.response) {
        if (error.response.status === 401) {
            response.message = "Неправильный логин или пароль";
            response.unauthorized = true;
        }
        else if (error.response.status === 400) {
            const data = error.response.data as ValidationResult;
            response.message = "Ошибка валидации";
            response.validatonResult = data;
        }
        else if (error.response.status === 404) {
            response.message = "Не найдено (404)";
        }
        else {
            if (error.response?.headers["content-type"]?.toString().includes("application/json")) {
                const data: any = error.response?.data;
                if (data instanceof Blob) {
                    let content: any = {};
                    try {
                        content = JSON.parse(await data.text());
                    } catch { /* empty */ }
                    response.message = content.message ?? "Неизвестная ошибка";
                }
                else {
                    response.message = data?.message|| "Неизвестная ошибка";
                }

            }
            else {
                response.message = "Неизвестная ошибка";
            }
        }

    } else if (error.request) {
        response.messageKey = "server_is_unavailable";
    } else {
        response.messageKey = "common_error";
        response.messageParams = { content: error.message };
    }
    return response;
}

export async function getDataFromAxiosResponse({ response }: { response: AxiosResponse<any, any> }) {
    const res = new ServerResponse();
    res.resultObj = response.data;
    res.success = true;
    return res;
}