import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <>        
            <h1>Página não encontrada</h1>
            <Link to="/">Voltar para HOME</Link>
        </>

    )
}

export default NotFound;