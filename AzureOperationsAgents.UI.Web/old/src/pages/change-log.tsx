import { Helmet } from 'react-helmet-async';
// sections
import {ChangeLogView} from "../sections/change-log/view";

// ----------------------------------------------------------------------

export default function ChangeLogPage() {
  return (
    <>
      <Helmet>
        <title> Terms and Conditions</title>
      </Helmet>

      <ChangeLogView />
    </>
  );
}
