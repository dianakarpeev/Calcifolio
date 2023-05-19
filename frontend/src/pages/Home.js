
import { useSearchParams, useLocation } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import ErrorBoundary from "components/ErrorBoundary";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { AllVideosCarousel } from "components/AllVideosCarousel";
import { AllArtwork } from "components/AllArtwork";
import { AllArtworkCarousel } from "components/AllArtworkCarousel";

function Home(){
    const [searchParams, setSearchParams ] = useSearchParams();
    const {state}= useLocation();



    

    return(
        <>
        <ErrorBoundary>
        {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
        <h1>Welcome to Calcifolio {searchParams.get('name')}!</h1>
        <h1>At A Glance</h1>
        <div></div>
        <Carousel width="80vw" infiniteLoop="true">
            <AllVideosCarousel></AllVideosCarousel>
            <div>
                <AllArtworkCarousel></AllArtworkCarousel>
            </div>
        </Carousel>
        </ErrorBoundary>
       
        </>
    );
}

export default Home;