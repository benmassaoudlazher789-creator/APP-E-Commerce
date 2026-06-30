import Card from 'react-bootstrap/Card';

function Footer() {
    return (
        <Card className="bg-dark text-white">
            <Card.Img src="https://plus.unsplash.com/premium_photo-1684785618727-378a3a5e91c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8RS1jb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D" alt="Card image" />
            <Card.ImgOverlay>
                <Card.Title>©️2026 APP E-Commerce. Tous droits réservés.</Card.Title>
                
            </Card.ImgOverlay>
        </Card>
    );
}

export default Footer;   