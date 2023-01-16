import React, { useState, useRef, useEffect } from 'react';
import { PageArea } from './styles';
import { PageContainer, PageTitle, ErrorMessage } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { useNavigate } from 'react-router-dom';

export const AddAd = () => {
    const api = useAPI();
    const fileField = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [priceNegotiable, setPriceNegotiable] = useState(false);
    const [desc, setDesc] = useState('');
    const [categories, setCategories] = useState<[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDisabled(true);
        setError('');
        let errors = [];

        if (!title.trim()) errors.push('Sem título');
        if (!category) errors.push('Sem categoria');

        if (errors.length === 0) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('price', price);
            formData.append('priceneg', priceNegotiable.toString());
            formData.append('desc', desc);
            formData.append('cat', category);

            if (fileField.current?.files && fileField.current?.files?.length > 0) {
                for (let i = 0; i < fileField.current?.files?.length; i++) {
                    formData.append('img', fileField.current.files[i]);
                }
            }

            const json = await api.addAd(formData);

            if (!json.error) {
                navigate(`/ad/${json.id}`);
                return;
            } else {
                setError(json.error)
            }

        } else {
            setError(errors.join("\n"));
        }

        setDisabled(false);

    };

    const priceMask = createNumberMask({
        prefix: 'R$ ',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: '.',
        allowDecimal: true,
        decimalSymbol: ','
    });

    useEffect(() => {
        const getCategories = async () => {
            const cats = await api.getCategories();
            setCategories(cats);
        }

        getCategories();
    }, [])

    return (
        <PageContainer>
            <PageTitle>Postar um Anúncio</PageTitle>
            <PageArea>
                {error &&
                    <ErrorMessage>{error}</ErrorMessage>
                }
                <form onSubmit={handleSubmit}>
                    <label className="area">
                        <div className="area-title">Título</div>
                        <div className="area-input">
                            <input type="text" disabled={disabled} value={title} onChange={event => setTitle(event.target.value)} required />
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">Categoria</div>
                        <div className="area-input">
                            <select disabled={disabled} onChange={event => setCategory(event.target.value)} required>
                                {categories.map((value: any, index: number) => (
                                    <option key={value._id}> {value.name}</option>
                                ))}
                            </select>
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">Preço</div>
                        <div className="area-input">
                            <MaskedInput mask={priceMask} placeholder="R$" disabled={disabled || priceNegotiable} onChange={event => setPrice(event.target.value)} />
                        </div>
                    </label>
                    <div className="areaCheckbox">
                        <label className="area">
                            <div className="area-title">Preço Negociável</div>
                        </label>
                        <div className="area-input">
                            <input type="checkbox" className="checkbox" disabled={disabled} checked={priceNegotiable} onChange={event => setPriceNegotiable(!priceNegotiable)} />
                        </div>
                    </div>
                    <label className="area">
                        <div className="area-title">Descrição</div>
                        <div className="area-input">
                            <textarea disabled={disabled} value={desc} onChange={event => setDesc(event.target.value)}></textarea>
                        </div>
                    </label>
                    <label className="area">
                        <div className="area-title">Imagens (1 ou mais)</div>
                        <div className="area-input">
                            <input type="file" disabled={disabled} ref={fileField} multiple />
                        </div>
                    </label>
                    <button disabled={disabled}>Adicionar Anúncio</button>
                </form>
            </PageArea >
        </PageContainer >
    );
}

export default AddAd;