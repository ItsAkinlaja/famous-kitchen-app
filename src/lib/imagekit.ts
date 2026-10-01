// Server-side only — never import this in client components
import { ImageKit } from "@imagekit/nodejs";

let _ik: InstanceType<typeof ImageKit> | null = null;

function getImageKit(): InstanceType<typeof ImageKit> {
  if (!_ik) {
    _ik = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }
  return _ik;
}

export async function uploadReceipt(
  fileBuffer: Buffer,
  fileName: string,
  _mimeType: string
): Promise<string> {
  const ik = getImageKit();
  // ImageKit v7 accepts base64 data URI as a string
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:${_mimeType};base64,${base64}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (ik.files.upload as any)({
    file: dataUri,
    fileName,
    folder: "famous-kitchen/payment-receipts",
    useUniqueFileName: true,
  });

  return (result as { url: string }).url;
}

export async function uploadMenuImage(
  fileBuffer: Buffer,
  fileName: string,
  _mimeType: string
): Promise<string> {
  const ik = getImageKit();
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:${_mimeType};base64,${base64}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (ik.files.upload as any)({
    file: dataUri,
    fileName,
    folder: "famous-kitchen/menu",
    useUniqueFileName: true,
  });

  return (result as { url: string }).url;
}
