import { Helmet } from 'react-helmet-async';
// sections
import { HomeView } from 'src/sections/home/view';
import {useAuthContext} from "../auth/useAuthContext";
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

export default function HomePage() {
    
    
  return (
    <>
      <Helmet>
        <title> Azure L1 Support</title>
      </Helmet>

      <HomeView />
    </>
  );
}
