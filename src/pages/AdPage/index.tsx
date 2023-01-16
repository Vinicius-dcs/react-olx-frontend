import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Slide } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import { PageArea, Fake, OthersArea, BreadChumb } from './styles';
import { PageContainer } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import AdItem from '../../components/AdItem';

export const AdPage = () => {
    const api = useAPI();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [adInfo, setAdInfo] = useState<any>([]);

    const formatDate = (date: string) => {
        let months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        let objectDate = new Date(date);
        let day = objectDate.getDate();
        let month = objectDate.getMonth();
        let year = objectDate.getFullYear();

        return `${day} de ${months[month]} de ${year}`;
    }

    const verifyOthers = (): boolean => {
        return adInfo.others.length > 0;
    }

    useEffect(() => {
        const getAdInfo = async (id: string | undefined) => {
            const json = await api.getAd(id, true);
            setAdInfo(json);
            setLoading(false);
        }

        getAdInfo(id);
    }, []);

    return (
        <PageContainer>
            {adInfo.category &&
                <BreadChumb>

                    Você está aqui:
                    <Link to="/">Home</Link>
                    /
                    <Link to={`/ads?state=${adInfo.stateName}`}>{adInfo.stateName}</Link>
                    /
                    <Link to={`/ads?state=${adInfo.stateName}&categorie=${adInfo.category.slug}`}>{adInfo.category.name}</Link>
                    / {adInfo.title}
                </BreadChumb>
            }
            <PageArea>
                <div className="leftSide">
                    <div className="box">
                        <div className="adImage">
                            {loading && <Fake height={300} />}
                            {adInfo.images &&
                                <Slide>

                                    {adInfo.images.map((value: string, index: number) =>
                                        <div key={index} className="each-slide">
                                            <img src={value} alt="" />
                                        </div>
                                    )}
                                </Slide>
                            }
                        </div>
                        <div className="adInfo">
                            <div className="adName">
                                {loading && <Fake height={20} />}
                                {adInfo.title &&
                                    <h2>{adInfo.title}</h2>
                                }
                                {adInfo.dateCreated &&
                                    <small>Criado em {formatDate(adInfo.dateCreated)}</small>
                                }
                            </div>
                            <div className="adDescription">
                                {loading && <Fake height={100} />}
                                {adInfo.description}

                                <hr />

                                {adInfo.views &&
                                    <small>Visualizações: {adInfo.views}</small>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightSide">
                    <div className="box box-padding">
                        {loading && <Fake height={20} />}
                        {adInfo.priceNegotiable &&
                            'Preço Negociável'
                        }
                        {!adInfo.priceNegotiable && adInfo.price &&
                            <div className="price">
                                Preço: <span>R$ {adInfo.price}</span>
                            </div>
                        }
                    </div>
                    {loading && <Fake height={50} />}
                    {adInfo.userInfo &&
                        <>
                            <a href={`mailto:${adInfo.userInfo.email}`} target="_blank" className="contactSellerLink">Fale com o vendedor</a>
                            <div className="createdBy box box-padding">
                                <strong>{adInfo.userInfo.name}</strong>
                                <small>E-mail: {adInfo.userInfo.email}</small>
                                <small>Estado: {adInfo.ustateName}</small>
                            </div>
                        </>
                    }
                </div>
            </PageArea>

            <OthersArea>
                {adInfo.others && verifyOthers() &&
                    <>
                        <h2>Outras ofertas do vendedor</h2>
                        <div className="list">
                            {adInfo.others.map((value: string, index: number) =>
                                <AdItem key={index} data={value} />
                            )}
                        </div>
                    </>
                }
            </OthersArea>

        </PageContainer>
    );
}

export default AdPage;