import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { isRouteErrorResponse, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import ProductDescriptionList from "~/components/products/comp/product-description-list";
import { ProductImageGallery } from "~/components/products/comp/product-image-gallery";
import { ImageUploadForm } from "~/components/products/comp/product-image-upload-form";
import { ListProductImages } from "~/components/products/comp/product-list-images";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProductEditData } from "~/server/domains/productDomain.server";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  const action = formData.get("_action");

  switch (action) {
    case "updateName":
      return json({ status: "ok", message: "Name Updated" }, { status: 200 });
    default:
      return json({ status: "ok" }, { status: 200 });
  }
};


export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);

  const { images, productBasic, imageUploadFormData } = await getProductEditData({ storeId, productId: params.productId ?? "none" });



  return json({ images, imageUploadFormData });
}



export default function ProductIdImageRoute() {
  const { images, imageUploadFormData } = useLoaderData<typeof loader>();


  return (
    <main className="">
      <div className="mx-auto max-w-xl flex flex-col gap-3 ">
        <h3 className="text-slate-100 text-2xl my-3 text-center" >
          Product Images
        </h3>
        <ProductImageGallery
          images={images}
        />
        <ListProductImages images={images} />
        <ImageUploadForm
          imageUploadFormData={imageUploadFormData}
        />
      </div>
    </main>
  )
}