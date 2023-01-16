import { Link } from 'react-router-dom';
import { Item } from './styles';
import image404 from './404.jpg'

export const AdItem = (props: any) => {
    let image = props.data.image;
    let price = '';

    price = props.data.priceNegotiable ? 'Preço Negociável' : `R$ ${props.data.price}`;
    image = image.includes('default') ? image404 : image;

    return (
        <Item className="adItem">
            <Link to={`/ad/${props.data.id}`}>
                <div className="itemImage">
                    <img src={image} alt="" />
                </div>
                <div className="itemName">{props.data.title}</div>
                <div className="itemPrice">{price}</div>
            </Link>
        </Item>
    )
}

export default AdItem;