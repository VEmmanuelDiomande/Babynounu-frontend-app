import { Browser } from "@capacitor/browser";

async function openDialer(phoneNumber: { phoneNumber: any }) {
  await Browser.open({ url: `tel:${phoneNumber.phoneNumber}` });
}

export default openDialer;
