import type { ContactPayload } from "./types";

export const sendContactMessage = async (
  payload: ContactPayload,
): Promise<void> => {
  await new Promise<void>((resolve) => setTimeout(resolve, 2000));
  console.log("Contact message sent:", payload);
};
