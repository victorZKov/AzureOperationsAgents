import { Helmet } from 'react-helmet-async';
// sections
import {RemoveMyDataView} from "../sections/remove-my-data/view";

// ----------------------------------------------------------------------

export default function RemoveMyDataPage() {
  return (
    <>
      <Helmet>
        <title> Remove My Data</title>
      </Helmet>

      <RemoveMyDataView />
    </>
  );
}
