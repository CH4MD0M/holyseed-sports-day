export interface RaffleItem {
  id: string;
  name: string;
  totalQuantity: number;
  usedQuantity: number;
  image?: string;
}

export const SAMPLE_RAFFLE_ITEMS: RaffleItem[] = [
  {
    id: '1',
    name: '삼성 갤럭시 탭',
    totalQuantity: 1,
    usedQuantity: 1,
    image: 'https://images.samsung.com/kdp/goods/2025/08/26/be9a2b1c-b4dc-40ec-9eb3-8f1a95adef9e.png?$PF_PRD_PNG$',
  },
  {
    id: '2',
    name: '에어팟 프로',
    totalQuantity: 3,
    usedQuantity: 1,
    image: 'https://i.namu.wiki/i/2Wg0Ga8nuKz1qC29HBh3sXZX8c0EyfvYKHeH5ruL9uy8XYrX2X8XZnPOMdfkHGbqekm1O2gTg_wKAA7syMCnVw.webp',
  },
  {
    id: '3',
    name: '스타벅스 기프티콘',
    totalQuantity: 5,
    usedQuantity: 3,
    image: 'https://www.biz-con.co.kr/upload/images/202312/400_20231219154235051_3.jpg',
  },
  {
    id: '4',
    name: '치킨 쿠폰',
    totalQuantity: 10,
    usedQuantity: 7,
    image: 'https://mblogthumb-phinf.pstatic.net/MjAyNDA2MjBfMTIw/MDAxNzE4ODUwMTc0MTEw.Myo6uU5cA3I4LW6pnFmfGysdhSiR-WxF0DSlbgk0bekg.0yWYcQxwp6cm-ZEYQbkSZ7ViUCgW0LD2xWoqpeg82jog.JPEG/SE-CD40C0AB-445E-444E-AFAA-7F6F5E6E1383.jpg?type=w800',
  },
];

export const getRaffleItemById = (id: string): RaffleItem | undefined => {
  return SAMPLE_RAFFLE_ITEMS.find(item => item.id === id);
};