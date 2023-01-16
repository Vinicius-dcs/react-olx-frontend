import Cookies from "js-cookie";
import qs from "qs";

type options = {
    sort: string,
    limit: number,
    q?: string,
    cat?: string,
    state?: string
}

const BASEAPI = 'http://alunos.b7web.com.br:501';

const fetchPost = async (endpoint: string, body: any) => {
    if (!body.token) {
        let token = Cookies.get('token');
        if (token) body.token = token;
    }

    const result = await fetch(BASEAPI + endpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await result.json();

    if (json.notallowed) window.location.href = '/signin';

    return json;
}

const fetchGet = async (endpoint: string, body?: any) => {
    let token = Cookies.get('token');
    let bodyToken = Object.assign({}, body, { token: token });
    if (token) body = bodyToken

    /* if(!body.token) {
        let token = Cookies.get('token');
        if (token) body.token = token;
    } */

    const result = await fetch(`${BASEAPI + endpoint}?${qs.stringify(body)}`);
    const json = await result.json();

    if (json.notallowed) window.location.href = '/signin';

    return json;
}

const fetchFile = async (endpoint: string, body: any) => {
    if (!body.token) {
        let token = Cookies.get('token');
        if (token) body.append('token', token);
    }

    const result = await fetch(BASEAPI + endpoint, {
        method: 'POST',
        body
    });
    const json = await result.json();

    if (json.notallowed) window.location.href = '/signin';

    return json;
}

export const OlxAPI = {
    login: async (email: string, password: string): Promise<any> => {
        const json = await fetchPost('/user/signin', { email, password });
        return json;
    },

    getStates: async () => {
        const json = await fetchGet('/states');
        return json.states;
    },

    register: async (name: string, email: string, password: string, stateLoc: string): Promise<any> => {
        const json = await fetchPost('/user/signup', { name, email, password, state: stateLoc });
        return json;
    },

    getCategories: async (): Promise<any> => {
        const json = await fetchGet('/categories');
        return json.categories;
    },

    getAds: async (options: options): Promise<any> => {
        const json = await fetchGet('/ad/list', options);
        return json.ads;
    },

    getAd: async (id: string | undefined, otherAds: boolean = false): Promise<any> => {
        const json = await fetchGet('/ad/item', { id, other: otherAds });
        return json;
    },

    addAd: async (formData: FormData): Promise<any> => {
        const json = await fetchFile('/ad/add', formData);
        return json;
    }
}

export default () => OlxAPI;