import TopNavBar from "../components/Navbar"
import HeroBanner from "../components/HeroBanner"
import Features from "../components/Features"
import VisualAnchor from "../components/VisualAnchor"
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
        <>
            <TopNavBar/>
            <HeroBanner/>
            <Features/>
            <VisualAnchor/>
            <Footer showFull />
        </>
    )
}

export default LandingPage