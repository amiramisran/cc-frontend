import React from 'react';
import { useParams } from 'react-router-dom';

import useGetInvoiceById from 'src/hooks/use-get-invoice';

import { InvoiceDetailsView } from 'src/sections/invoice/view';

function InvoicePage() {
  const { id } = useParams();
  const data = useGetInvoiceById(id);
  console.log(data.campaigns);
  // get invoice by id
  return <InvoiceDetailsView data={data.campaigns} />;
}

export default InvoicePage;
