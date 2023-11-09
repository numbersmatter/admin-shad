import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import KanbanBoardPage from "~/components/workboard/old/KanboardPage";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getKanbanData, moveCard, sortCard } from "~/server/domains/workboard-domain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);
  const formData = await request.clone().formData();
  const action = formData.get("_action");
  const activeId = formData.get("activeId");
  const overId = formData.get("overId");
  const index = formData.get("index") as string;
  const containerId = formData.get("containerId") as string;
  const srcContainerId = formData.get("srcContainerId") as string;


  if (action === "moveCard") {
    const result = await moveCard({
      storeId,
      cardId: activeId as string,
      overId: overId as string
    })
    return json({ message: "moveCard", result });
  }


  if (action === "sortCard") {
    const result = await sortCard({
      storeId,
      cardId: activeId as string,
      containerId,
      index: Number(index),
      srcContainerId,
    })
    return json({ message: "sortCard", result });
  }


  return json({ message: " invalid action" });
}




export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  const {
    columns,
    columnOrder,
    columnData,
    cardData
  } = await getKanbanData({ storeId })


  return json({
    columns,
    columnOrder,
    columnData,
    cardData
  });
}



export default function RouteName() {
  const { columns, columnOrder, columnData, cardData } = useLoaderData<typeof loader>();
  return (
    <KanbanBoardPage
      columns={columns}
      columnOrder={columnOrder}
      columnData={columnData}
      cardData={cardData}
    />

  );
}