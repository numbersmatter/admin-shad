import type { ActionFunctionArgs, LoaderFunctionArgs, UploadHandler } from "@remix-run/node";
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  json,
  redirect,
} from "@remix-run/node";
// import { addProductImage, readProduct } from "~/server/database/product.server";
import { uploadImage } from "~/server/integrations/cloudinary.server";
import { readProduct } from "~/server/database/product.server";
import { addProductImage } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const productId = params.productId ?? "none";
  const cloneFormData = await request.clone().formData();
  const cloneStoreId = cloneFormData.get("storeId") as string;
  const cloneReturnUrl = cloneFormData.get("returnUrl") as string;


  const product = await readProduct({ storeId: cloneStoreId as string, productId })

  if (!product) {
    return redirect(cloneReturnUrl ?? `/`)
  }


  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      if (!data) {
        return undefined
      }

      const uploadedImage = await uploadImage({
        data,
        referenceId: productId,
      });
      return uploadedImage.secure_url;
    },
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(request, uploadHandler);

  const imgSrc = formData.get("img") as string;
  const imgDesc = formData.get("desc") as string;
  const imageName = formData.get("fileName") as string;
  const returnUrl = formData.get("returnUrl") as string;
  const storeId = formData.get("storeId") as string;

  if (!imgSrc) {
    return json({ error: "something wrong" });
  }
  // random id
  // const id = randomId();

  const imageUpload = {
    name: imageName ?? "none",
    src: imgSrc,
    alt: ""
  }

  await addProductImage({ storeId, productId, image: imageUpload })

  return redirect(returnUrl ?? `/products/${productId}/images`);
}







