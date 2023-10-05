
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { StandardDataTable } from "~/components/common/standard-data-table";
import { productColumnsLong, productColumnsShort, productRowTestData } from "~/components/products/product-columns";

import { StandardShell } from "~/components/shell/shell";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProductsPageData } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request);  

  return json({});
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);

  const { productPageData } = await getProductsPageData({ storeId });


  return json({ productPageData });
}



export default function ProjectsRoute() {
  const { productPageData } = useLoaderData<typeof loader>();


  const pageTitle = "Products and Services";
  const pageDescription = "Your studio's products and services";

  return (
    <>
      <main className="flex h-full flex-1 flex-col space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between space-y-2 p-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {pageTitle}
            </h2>
            <p className="text-muted-foreground">
              {pageDescription}
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <div className="hidden px-0 sm:block lg:px-4">
          <div className="border-0  border-accent-foreground  lg:border-2 lg:rounded-md lg:p-4 ">
            <StandardDataTable
              columns={productColumnsLong}
              data={productPageData.products}
            />
          </div>
        </div>
        <div className="px-0  sm:hidden">
          <div className="">
            <StandardDataTable
              columns={productColumnsShort}
              data={productPageData.products}
            />
          </div>
        </div>
        <div className="h-8" />
      </main>
    </>
  );
}

