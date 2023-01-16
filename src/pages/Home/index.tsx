import React, { useState, useEffect } from 'react';
import { PageArea, SearchArea } from './styles';
import { PageContainer } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import { Link } from 'react-router-dom';
import AdItem from '../../components/AdItem';

export const Home = () => {
    const api = useAPI();

    const [stateList, setStateList] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [adsList, setAdsList] = useState<any[]>([]);

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
    }, [])

    return (
        <>
            <SearchArea>
                <PageContainer>
                    <div className="searchBox">
                        <form action="/ads" method="GET">
                            <input type="text" name="q" placeholder="O que você procura?" />
                            <select name="state">
                                {stateList.map((value, index) => (
                                    <option key={index} value={value.name}>{value.name}</option>
                                ))}
                            </select>
                            <button>Pesquisar</button>
                        </form>
                    </div>
                    <div className="categoryList">
                        {categories.map((value, index) => (
                            <Link key={index} to={`/ads?cat=${value.slug}`} className="categoryItem">
                                <img src={value.img} alt="" />
                                <span>{value.name}</span>
                            </Link>
                        ))}
                    </div>
                </PageContainer>
            </SearchArea>

            <PageContainer>
                <PageArea>
                    <h2>Anúncios Recentes</h2>
                    <div className="list">
                        {adsList.map((value, index) => (
                            <AdItem key={index} data={value} />
                        ))}
                    </div>
                    <Link to="/ads" className="seAllLink">Ver todos</Link>

                    <hr />

                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    
                </PageArea>
            </PageContainer>
        </>
    );
}

export default Home;