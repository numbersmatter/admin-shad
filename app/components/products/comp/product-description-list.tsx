import { PaperClipIcon } from '@heroicons/react/20/solid'
import { ButtonDialogArea } from '~/components/common/button-dialogue-area'
import { ButtonDialogField } from '~/components/common/button-dialogue-field'
import { Button } from '~/components/ui/button'

export default function ProductDescriptionList({
  productBasic,
}: {
  productBasic: {
    name: string
    priceRange: string
    description: string
    pricing: string
  }
}) {
  const { name, priceRange, description, pricing } = productBasic;
  return (
    <>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-primary-foreground">Product Basic Information</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary-foreground">Product Name</dt>
            <dd className="mt-1 flex text-sm leading-6 text-secondary-foreground sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{name}</span>
              <span className="ml-4 flex-shrink-0">
                <ButtonDialogField
                  buttonLabel={"Update"}
                  dialogTitle={"Update Product Name"}
                  dialogDescription={"Update the product name here."}
                  inputLabel={"Product Name"}
                  inputId={"name"}
                  inputDefaultValue={name}
                  saveLabel={"Save Changes"}
                  _action={"updateName"}
                />
              </span>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary-foreground">Price Range</dt>
            <dd className="mt-1 flex text-sm leading-6 text-secondary-foreground sm:col-span-2 sm:mt-0">
              <span className="flex-grow">{priceRange}</span>
              <span className="ml-4 flex-shrink-0">
                <ButtonDialogField
                  buttonLabel={"Update"}
                  dialogTitle={"Update Price Range"}
                  dialogDescription={"Update the product price range."}
                  inputLabel={"Product Price Range"}
                  inputId={"priceRange"}
                  inputDefaultValue={priceRange}
                  saveLabel={"Save Changes"}
                  _action={"updatePriceRange"}
                />
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary-foreground">Description</dt>
            <dd className="mt-1 flex text-sm leading-6 text-secondary-foreground sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {description}
              </span>
              <span className="ml-4 flex-shrink-0">
                <ButtonDialogArea
                  buttonLabel={"Update"}
                  dialogTitle={"Update Description"}
                  dialogDescription={"Update the product description."}
                  inputLabel={"Product Description"}
                  inputId={"description"}
                  inputDefaultValue={description}
                  saveLabel={"Save Changes"}
                  _action={"updateDescription"}
                />
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-primary-foreground">Pricing </dt>
            <dd className="mt-1 flex text-sm leading-6 text-secondary-foreground sm:col-span-2 sm:mt-0">
              <span className="flex-grow">
                {pricing}
              </span>
              <span className="ml-4 flex-shrink-0">
                <ButtonDialogArea
                  buttonLabel={"Update"}
                  dialogTitle={"Update Pricing"}
                  dialogDescription={"Update the product pricing."}
                  inputLabel={"Product Pricing"}
                  inputId={"pricing"}
                  inputDefaultValue={pricing}
                  saveLabel={"Save Changes"}
                  _action={"updatePricing"}
                />
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </>
  )
}
