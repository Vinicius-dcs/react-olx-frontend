import React, { useState, useEffect } from 'react';
import { PageArea } from './styles';
import { PageContainer, PageTitle, ErrorMessage } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import { login } from '../../helpers/AuthHandler';

export const SignUp = () => {
    const api = useAPI();

    const [name, setName] = useState('');
    const [stateLoc, setStateLoc] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [stateList, setStateList] = useState<any[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDisabled(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Senhas não são iguais!');
            setDisabled(false);
            return;
        }

        const json = await api.register(name, email, password, stateLoc);

        if (!json.error) {
            login(json.token);
            window.location.href = '/';
        } else {
            setError(json.error)
        }

        setDisabled(false);
    };

    useEffect(() => {
        const getStates = async () => {
            const list = await api.getStates();
            setStateList(list);
            setStateLoc(list[0]);
        }
        getStates();
    }, [])

    return (
        <PageContainer>
            <PageTitle>Cadastro</PageTitle>
            <PageArea>
                {error &&
                    <ErrorMessage>{error}</ErrorMessage>
                }
                <form onSubmit={handleSubmit}>
                    <label className="area">
                        <div className="area-title">Nome Completo</div>
                        <div className="area-input">
                            <input type="text" value={name} disabled={disabled} onChange={event => setName(event.target.value)} required />
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">Estado</div>
                        <div className="area-input">
                            <select value={stateLoc} onChange={event => setStateLoc(event.target.value)} required>
                                {stateList.map((value, index) => (
                                    <option key={index} value={value._id}> {value.name}</option>
                                ))}
                            </select>
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">E-mail</div>
                        <div className="area-input">
                            <input type="email" value={email} disabled={disabled} onChange={event => setEmail(event.target.value)} required />
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">Senha</div>
                        <div className="area-input">
                            <input type="password" value={password} disabled={disabled} onChange={event => setPassword(event.target.value)} required />
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">Confirmar Senha</div>
                        <div className="area-input">
                            <input type="password" value={confirmPassword} disabled={disabled} onChange={event => setConfirmPassword(event.target.value)} required />
                        </div>
                    </label>

                    <button disabled={disabled}>Fazer Cadastro</button>
                </form>
            </PageArea>
        </PageContainer>
    );
}

export default SignUp;