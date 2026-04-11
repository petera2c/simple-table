interface BlushImageConfig {
  style: string;
  seed: string;
  width: number;
  height: number;
  bgColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function getBlushImageUrl(config: BlushImageConfig): string {
  const { style, seed, width, height, bgColor, primaryColor, secondaryColor } = config;

  const baseUrl = `https://blush.design/api/download?style=${style}&seed=${seed}&width=${width}&height=${height}`;
  const params = new URLSearchParams();

  if (bgColor) params.append("bgColor", bgColor);
  if (primaryColor) params.append("primaryColor", primaryColor);
  if (secondaryColor) params.append("secondaryColor", secondaryColor);

  return `${baseUrl}&${params.toString()}`;
}

// Example usage:
// const imageUrl = getBlushImageUrl({
//   style: 'micah',
//   seed: 'table',
//   width: 1200,
//   height: 630,
//   bgColor: 'f5f5f5',
//   primaryColor: '4f46e5',
//   secondaryColor: '818cf8'
// });

interface UnDrawImageConfig {
  name: string;
  primaryColor?: string;
  width?: number;
  height?: number;
}

export function getUnDrawImageUrl(config: UnDrawImageConfig): string {
  const { name, primaryColor = "4f46e5", width = 1200, height = 630 } = config;

  const baseUrl = `https://undraw.co/illustrations/${name}`;
  const params = new URLSearchParams();

  if (primaryColor) params.append("primaryColor", primaryColor);
  if (width) params.append("width", width.toString());
  if (height) params.append("height", height.toString());

  return `${baseUrl}?${params.toString()}`;
}

// Example usage:
// const imageUrl = getUnDrawImageUrl({
//   name: 'developer-activity',
//   primaryColor: '4f46e5',
//   width: 1200,
//   height: 630
// });

interface OpenPeepsImageConfig {
  name: string;
  skinColor?: string;
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  width?: number;
  height?: number;
}

export function getOpenPeepsImageUrl(config: OpenPeepsImageConfig): string {
  const {
    name,
    skinColor = "F2D3B8",
    hairColor = "2C1810",
    shirtColor = "4f46e5",
    pantsColor = "1e293b",
    width = 1200,
    height = 630,
  } = config;

  const baseUrl = `https://openpeeps.com/illustrations/${name}`;
  const params = new URLSearchParams();

  if (skinColor) params.append("skinColor", skinColor);
  if (hairColor) params.append("hairColor", hairColor);
  if (shirtColor) params.append("shirtColor", shirtColor);
  if (pantsColor) params.append("pantsColor", pantsColor);
  if (width) params.append("width", width.toString());
  if (height) params.append("height", height.toString());

  return `${baseUrl}?${params.toString()}`;
}

// Example usage:
// const imageUrl = getOpenPeepsImageUrl({
//   name: 'developer',
//   skinColor: 'F2D3B8',
//   hairColor: '2C1810',
//   shirtColor: '4f46e5',
//   pantsColor: '1e293b',
//   width: 1200,
//   height: 630
// });
