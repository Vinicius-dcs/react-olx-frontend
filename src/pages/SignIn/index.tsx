import React, { useState } from 'react';
import { PageArea } from './styles';
import { PageContainer, PageTitle, ErrorMessage } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import { login } from '../../helpers/AuthHandler';

export const SignIn = () => {
    const api = useAPI();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberPassword, setRememberPassword] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDisabled(true);
        setError('');

        const json = await api.login(email, password);

        if (!json.error) {
            login(json.token, rememberPassword);
            window.location.href = '/';
        } else {
            setError(json.error)
        }

        setDisabled(false);
    };

    return (
        <PageContainer>
            <PageTitle>Login</PageTitle>
            <PageArea>
                {error &&
                    <ErrorMessage>{error}</ErrorMessage>
                }
                <form onSubmit={handleSubmit}>
                    <label className="area">
                        <div className="area-title">E-mail</div>
                        <div className="area-input">
                            <input type="email" disabled={disabled} onChange={event => setEmail(event.target.value)} required />
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">Senha</div>
                        <div className="area-input">
                            <input type="password" disabled={disabled} onChange={event => setPassword(event.target.value)} required />
                        </div>
                    </label>
                    <div className="areaCheckbox">
                        <label className="area">
                            <div className="area-title">Lembrar Senha</div>
                        </label>
                        <div className="area-input">
                            <input type="checkbox" className="checkbox" disabled={disabled} checked={rememberPassword} onChange={() => setRememberPassword(!rememberPassword)} />
                        </div>
                    </div>
                    <button disabled={disabled}>Fazer Login</button>
                </form>
            </PageArea>
        </PageContainer>
    );
}

export default SignIn;