import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export interface ImageUploadFormData {
  type: string,
  attachId: string,
  uploadUrl: string,
  returnUrl: string,
  storeId: string
}



export function ImageUploadForm({
  imageUploadFormData
}: {
  imageUploadFormData: ImageUploadFormData
}) {
  const { type, attachId, uploadUrl, returnUrl, storeId } = imageUploadFormData;

  const fetcher = useFetcher();
  const [filesPresent, setFilesPresent] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const actionData = fetcher.data

  const submit = fetcher.submit;
  let formRef = useRef();
  let fileInputRef = useRef(null);


  const actionUrl = uploadUrl
  let isUploading = fetcher.state !== "idle"


  const checkFilesPresent = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const filesArray = e.currentTarget.files ?? []
    const areFiles = filesArray.length > 0

    if (areFiles) {
      setFileName(filesArray[0].name)
      return setFilesPresent(true)
    }
    return setFilesPresent(false)
  };
  const openFileInput = () => {
    // @ts-ignore
    fileInputRef.current.click()
  }

  useEffect(() => {
    if (filesPresent && formRef.current) {
      submit(formRef.current, {})
    }
  }, [filesPresent, submit])

  useEffect(() => {
    if (!isUploading) {
      // @ts-ignore
      formRef.current?.reset()
      setFilesPresent(false)
    }
  }, [isUploading])


  const regularClass = "rounded-md bg-slate-600 px-2.5 py-1.5 text-lg font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-800"

  const disabledClass = "rounded-md bg-grey-500 px-2.5 py-1.5 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"



  return (
    <fetcher.Form
      replace
      method="post"
      encType="multipart/form-data"
      action={actionUrl}
      // @ts-ignore
      ref={formRef}
    >
      {actionData ? <p>{JSON.stringify(actionData)}</p> : <p>
      </p>}
      <fieldset className="grid grid-cols-1 py-3">
        <div className="mx-auto py-2">

          <input
            ref={fileInputRef}
            hidden// className="hidden"
            onChange={(e) => checkFilesPresent(e)}
            id="img-field"
            type="file"
            name="img"
            accept="image/*"
          />
          <input
            className="hidden"
            name="fileName"
            value={fileName}
            readOnly
          />
          <input hidden readOnly name="type" value={type} />
          <input hidden readOnly name="attachId" value={attachId} />
          <input hidden readOnly name="returnUrl" value={returnUrl} />
          <input hidden readOnly name="storeId" value={storeId} />

          <button
            type="button"
            className={isUploading ? disabledClass : regularClass}
            onClick={openFileInput}
            disabled={isUploading}
          >

            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </fieldset>
    </fetcher.Form>
  )
}
