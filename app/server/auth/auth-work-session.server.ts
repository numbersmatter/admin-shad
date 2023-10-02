import { Session, redirect } from "@remix-run/node";
import { getSessionAndUid, requireAuth } from "../auth/auth.server";
import { createUser, readUser } from "../database/furbrushUser.server";

interface WorkSession {
  uid: string;
  session: Session;
  storeId: string;
}

export const intializeWorkSession = async (
  request: Request
): Promise<WorkSession> => {
  const { uid, session } = await getSessionAndUid(request);
  if (!uid) {
    throw redirect("/login");
  }

  const furbrushUser = await readUser(uid);
  if (!furbrushUser) {
    await createUser({ storeId: uid, stores: [] });
    redirect("/studio-setup");
  }

  const storeId = furbrushUser?.storeId ?? "none";
  if (storeId === "none") {
    redirect("/studio-setup");
  }

  return { uid, storeId, session };
};
