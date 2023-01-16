import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageArea } from './styles';
import { PageContainer } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import AdItem from '../../components/AdItem';

let timer: any;

export const Home = () => {
    const api = useAPI();
    const navigate = useNavigate();

    const useQueryString = () => {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQueryString();

    const [q, setQ] = useState<any>(query.get('q') != null ? query.get('q') : '');
    const [cat, setCat] = useState<any>(query.get('cat') != null ? query.get('cat') : '');
    const [state, setState] = useState<any>(query.get('state') != null ? query.get('state') : '');
    const [stateList, setStateList] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [adsList, setAdsList] = useState<any[]>([]);
    const [resultOpacity, setResultOpacity] = useState<any>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const getAdsList = async () => {
        setLoading(true);

        const json = await api.getAds({
            sort: 'desc',
            limit: 9,
            q,
            cat,
            state
        });

        setAdsList(json);
        setResultOpacity(1);
        setLoading(false);
    }

    useEffect(() => {
        let queryString = [];

        if (q) queryString.push(`q=${q}`);
        if (cat) queryString.push(`cat=${cat}`);
        if (state) queryString.push(`state=${state}`);

        navigate(`?${queryString.join('&')}`, { replace: true })

        if (timer) clearTimeout(timer);
        timer = setTimeout(getAdsList, 1000);
        setResultOpacity(0.3);
    }, [q, cat, state]);

    useEffect(() => {
        const getStates = async () => {
            const list = await api.getStates();
            setStateList(list);
        }

        const getCategories = async () => {
            const list = await api.getCategories();
            setCategories(list);
        }

        const getRecentAds = async () => {
            const list = await api.getAds({ sort: 'desc', limit: 8 });
            setAdsList(list);
        }

        getStates();
        getCategories();
        getRecentAds();
    }, []);

    return (
        <PageContainer>
            <PageArea>
                <div className="leftSide">
                    <form method="GET">
                        <input type="text" name="q" placeholder="O que você procura?" value={q} onChange={event => setQ(event.target.value)} />

                        <div className="filterName">Estado:</div>
                        <select name="state" value={state} onChange={event => setState(event.target.value)}>
                            <option value=""></option>
                            {stateList.map((value, index) => (
                                <option key={index} value={value.name}>{value.name}</option>
                            ))}
                        </select>

                        <div className="filterName">Categoria:</div>
                        <ul>
                            {categories.map((value, index) => (
                                <li
                                    key={index}
                                    className={cat == value.slug ? 'categoryItem active' : 'categoryItem'}
                                    onClick={() => setCat(value.slug)}
                                >
                                    <img src={value.img} alt="" />
                                    <span>{value.name}</span>
                                </li>
                            ))}
                        </ul>
                    </form>
                </div>
                <div className="rightSide">
                    <h2>Resultados</h2>

                    {loading &&
                        <div className="listWarning">Carregando...</div>
                    }
                    {!loading && adsList.length === 0 &&
                        <div className="listWarning">Não encontramos resultados.</div>
                    }

                    <div className="list" style={{ opacity: resultOpacity }}>
                        {adsList.map((value, index) => (
                            <AdItem key={index} data={value} />
                        ))}
                    </div>
                </div>
            </PageArea>
        </PageContainer >
    );
}

export default Home;