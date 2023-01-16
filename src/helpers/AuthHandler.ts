import Cookies from 'js-cookie';

export const isLogged = () => {
    return Cookies.get('token') ? true : false;
}

export const login = (token: string, rememberPassword: boolean = false) => {
    rememberPassword ? Cookies.set('token', token, { expires: 999 }) : Cookies.set('token', token);
}

export const logout = () => {
    Cookies.remove('token');
}