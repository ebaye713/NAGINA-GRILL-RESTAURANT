import heroFeastImg from '../assets/images/hero_nagina_feast_1794609820681.jpg';
import halwaPuriImg from '../assets/images/special_halwa_puri_1794609820223.jpg';
import nihariImg from '../assets/images/special_nihari_1794609820930.jpg';
import payaImg from '../assets/images/special_paya_1794609821330.jpg';
import haleemImg from '../assets/images/special_haleem_1794609821979.jpg';
import tandooriGrillImg from '../assets/images/gallery_tandoori_grill_1794609822813.jpg';

export const RESTAURANT_INFO = {
  name: 'Nagina Grill & Restaurant',
  shortName: 'Nagina Grill',
  cuisine: 'Authentic Pakistani & Desi Charcoal Kitchen',
  addressLine1: '93 Longbridge Road',
  addressLine2: 'Barking IG11 8TB',
  fullAddress: '93 Longbridge Road, Barking IG11 8TB',
  phoneDisplay: '+44 20 8594 8153',
  phoneHref: 'tel:+442085948153',
  reportedRating: 4.5,
  hours: [
    {days: 'Monday – Saturday', time: '12:00 PM – 12:00 AM', note: 'Lunch, Charcoal Grill & Late Dinner'},
    {days: 'Sunday', time: '9:00 AM – 12:00 AM', note: 'Opens 9am for Weekend Breakfast Specials'},
  ],
  portfolio: {
    agency: 'ebastech',
    url: 'https://portfolio-five-omega-27.vercel.app',
  },
} as const;

export const HERO_MEDIA = {
  image: heroFeastImg,
  alt: 'Nagina Grill & Restaurant feast featuring charcoal lamb chops, seekh kebabs, copper karahi, saffron biryani, and blistered garlic naan',
};

export const ABOUT_MEDIA = {
  image: tandooriGrillImg,
  alt: 'Sizzling Pakistani charcoal mixed grill platter with lamb chops, seekh kebabs, chicken tikka boti, and fresh mint chutney',
};

export interface WeekendSpecial {
  id: string;
  name: string;
  urduSubtitle: string;
  availability: string;
  description: string;
  pairing: string;
  image: string;
  alt: string;
  priceStatus: string;
}

export const WEEKEND_SPECIALS: WeekendSpecial[] = [
  {
    id: 'halwa-puri',
    name: 'Halwa Puri',
    urduSubtitle: 'Traditional Desi Breakfast Thali',
    availability: 'Sat & Sun · From 9:00 AM Sun',
    description:
      'Hand-stretched golden puris fried crisp to order, served alongside fragrant saffron suji halwa studded with pistachios, spiced Lahori chana masala, tangy aloo bhaji, and house mango achar.',
    pairing: 'Best paired with Kashmiri Pink Chai or Karak Chai',
    image: halwaPuriImg,
    alt: 'Traditional Pakistani Halwa Puri breakfast platter with puffed golden puris, saffron suji halwa, chana masala, and aloo bhaji',
    priceStatus: 'Call for weekend platter pricing',
  },
  {
    id: 'nihari',
    name: 'Lahori Beef Nihari',
    urduSubtitle: 'Overnight Slow-Braised Shank',
    availability: 'Weekend Chef Special',
    description:
      'Prime beef shank and bone marrow simmered gently overnight with toasted fennel, dry ginger, black cardamom, and star anise until fork-tender in a deeply spiced crimson gravy.',
    pairing: 'Garnished with ginger juliennes, green chillies & served with khameeri naan',
    image: nihariImg,
    alt: 'Slow-cooked Lahori Beef Nihari in an artisanal copper bowl topped with ginger juliennes, fresh chillies, and lemon beside tandoori naan',
    priceStatus: 'Call for portion pricing',
  },
  {
    id: 'paya',
    name: 'Desi Lamb Paya',
    urduSubtitle: 'Heritage Slow-Simmered Broth',
    availability: 'Weekend Morning & Evening Special',
    description:
      'Traditional lamb trotters slow-cooked over low flame for hours to release rich natural collagen, aromatic whole spices, and silky depth—finished with crispy fried shallots and fresh coriander.',
    pairing: 'Served piping hot with tandoori roti or freshly baked naan',
    image: payaImg,
    alt: 'Traditional Desi Lamb Paya stew in an artisanal brass handi pot garnished with crispy fried shallots, ginger, and coriander',
    priceStatus: 'Call for portion pricing',
  },
  {
    id: 'haleem',
    name: 'Shahi Haleem',
    urduSubtitle: 'Slow-Pounded Grain & Meat',
    availability: 'Weekend Special',
    description:
      'Cracked wheat, barley, and four heritage lentils slow-cooked and hand-pounded with tender shredded meat into a velvety delicacy, topped with caramelized birista onions, ginger, and fresh lime.',
    pairing: 'Enjoyed solo with warm naan and spiced chaat masala',
    image: haleemImg,
    alt: 'Pakistani Shahi Haleem in a hammered copper bowl topped with crispy caramelized onions, ginger strips, green chillies, and lime',
    priceStatus: 'Call for portion pricing',
  },
];

export type MenuCategory =
  | 'All'
  | 'Charcoal Grill'
  | 'Karahi & Handi'
  | 'Weekend Specials'
  | 'Biryani & Rice'
  | 'Tandoori Breads & Sides'
  | 'Drinks & Desserts';

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Charcoal Grill',
  'Karahi & Handi',
  'Weekend Specials',
  'Biryani & Rice',
  'Tandoori Breads & Sides',
  'Drinks & Desserts',
];

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  description: string;
  dietary?: 'Halal' | 'Vegetarian' | 'Vegan Option';
  spice?: 'Mild' | 'Medium' | 'Spicy';
  priceLabel: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // Charcoal Grill
  {
    id: 'nagina-mixed-grill',
    name: 'Nagina Signature Mixed Grill',
    category: 'Charcoal Grill',
    description:
      'Sizzling cast-iron platter of masala lamb chops, chicken tikka boti, lamb seekh kebabs, and chargrilled wings with grilled onions and mint raita.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'masala-lamb-chops',
    name: 'Charcoal Masala Lamb Chops',
    category: 'Charcoal Grill',
    description:
      'Tender Welsh lamb chops marinated 24 hours in yoghurt, raw papaya, crushed coriander, and Kashmiri chilli, seared over glowing charcoal.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'lamb-seekh-kebabs',
    name: 'Lahori Lamb Seekh Kebabs',
    category: 'Charcoal Grill',
    description:
      'Hand-minced lamb shoulder seasoned with fresh mint, roasted cumin, and green chillies, skewered and roasted over open coals.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'chicken-malai-boti',
    name: 'Chicken Malai Boti',
    category: 'Charcoal Grill',
    description:
      'Succulent boneless chicken thigh marinated in double cream, cheddar, white pepper, and green cardamom, charred until smoky and tender.',
    dietary: 'Halal',
    spice: 'Mild',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'tandoori-chicken-half',
    name: 'Chargrilled Tandoori Chicken',
    category: 'Charcoal Grill',
    description:
      'Classic bone-in chicken scored and steeped in spiced yoghurt, ginger-garlic paste, and dried fenugreek, finished in the clay tandoor.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  // Karahi & Handi
  {
    id: 'lamb-karahi',
    name: 'Peshawari Lamb Karahi',
    category: 'Karahi & Handi',
    description:
      'Bone-in lamb stir-cooked to order in a heavy iron wok with vine tomatoes, cracked black pepper, fresh ginger, and green chillies.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'chicken-karahi',
    name: 'Lahori Chicken Karahi',
    category: 'Karahi & Handi',
    description:
      'Fresh chicken simmered rapidly in an aromatic tomato-garlic reduction with crushed coriander seeds, butter, and fresh coriander.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'butter-chicken-handi',
    name: 'Makhani Chicken Handi',
    category: 'Karahi & Handi',
    description:
      'Charred chicken tikka folded into a velvety tomato, cashew, and kasoori methi butter sauce finished with a swirl of cream.',
    dietary: 'Halal',
    spice: 'Mild',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'tadka-daal',
    name: 'Tadka Daal Chana & Mash',
    category: 'Karahi & Handi',
    description:
      'Slow-simmered golden lentils finished with a sizzling ghee tempering of toasted cumin, whole red chillies, and roasted garlic.',
    dietary: 'Vegetarian',
    spice: 'Mild',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'paneer-karahi',
    name: 'Desi Paneer Karahi',
    category: 'Karahi & Handi',
    description:
      'Golden-seared Indian cottage cheese tossed with bell peppers, vine tomatoes, crushed coriander, and warm garam masala.',
    dietary: 'Vegetarian',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  // Weekend Specials
  {
    id: 'menu-halwa-puri',
    name: 'Halwa Puri Weekend Platter',
    category: 'Weekend Specials',
    description:
      'Two crisp puffed puris, saffron suji halwa with nuts, Lahori chana masala, aloo bhaji, and tangy house achar.',
    dietary: 'Vegetarian',
    spice: 'Mild',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'menu-nihari',
    name: 'Lahori Beef Nihari',
    category: 'Weekend Specials',
    description:
      'Slow-braised beef shank in rich bone-marrow spiced gravy with julienned ginger, green chillies, and fresh lemon.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'menu-paya',
    name: 'Desi Lamb Paya',
    category: 'Weekend Specials',
    description:
      'Overnight-simmered lamb trotters in aromatic bone broth garnished with crispy fried shallots, ginger, and coriander.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'menu-haleem',
    name: 'Shahi Haleem',
    category: 'Weekend Specials',
    description:
      'Velvety slow-pounded wheat, lentils, and shredded meat topped with caramelized birista onions, ginger, and lime.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  // Biryani & Rice
  {
    id: 'lamb-dum-biryani',
    name: 'Sindhi Lamb Dum Biryani',
    category: 'Biryani & Rice',
    description:
      'Aged basmati rice steamed under sealed pastry with spiced tender lamb, saffron milk, fried onions, and fresh mint, served with raita.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'chicken-biryani',
    name: 'Lahori Chicken Biryani',
    category: 'Biryani & Rice',
    description:
      'Fragrant layered basmati rice cooked with bone-in spiced chicken, whole cloves, cardamom, and caramelized shallots.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'pilau-rice',
    name: 'Aromatic Jeera & Saffron Pilau',
    category: 'Biryani & Rice',
    description:
      'Fluffy long-grain basmati infused with toasted cumin seeds, bay leaf, and delicate saffron strands.',
    dietary: 'Vegan Option',
    spice: 'Mild',
    priceLabel: 'Price on enquiry',
  },
  // Tandoori Breads & Sides
  {
    id: 'garlic-coriander-naan',
    name: 'Garlic & Coriander Tandoori Naan',
    category: 'Tandoori Breads & Sides',
    description:
      'Hand-stretched leavened dough baked on clay tandoor walls and brushed with roasted garlic butter and fresh cilantro.',
    dietary: 'Vegetarian',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'keema-naan',
    name: 'Stuffed Lamb Keema Naan',
    category: 'Tandoori Breads & Sides',
    description:
      'Crisp clay-oven naan generously stuffed with spiced minced lamb, fresh herbs, and green chillies.',
    dietary: 'Halal',
    spice: 'Medium',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'tandoori-roti',
    name: 'Wholemeal Tandoori Roti',
    category: 'Tandoori Breads & Sides',
    description:
      'Traditional whole-wheat flatbread baked fresh in the tandoor—the ideal companion for Nihari, Paya, and Karahi.',
    dietary: 'Vegan Option',
    priceLabel: 'Price on enquiry',
  },
  // Drinks & Desserts
  {
    id: 'mango-lassi',
    name: 'Alphonso Mango Lassi',
    category: 'Drinks & Desserts',
    description:
      'Chilled creamy yoghurt churned with sweet Alphonso mango pulp and a whisper of green cardamom.',
    dietary: 'Vegetarian',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'karak-chai',
    name: 'House Karak Chai',
    category: 'Drinks & Desserts',
    description:
      'Strong Assam tea simmered slowly with evaporated milk, crushed cardamom pods, and warm spice.',
    dietary: 'Vegetarian',
    priceLabel: 'Price on enquiry',
  },
  {
    id: 'kheer-gulab-jamun',
    name: 'Warm Gulab Jamun / Pistachio Kheer',
    category: 'Drinks & Desserts',
    description:
      'Golden milk dumplings steeped in rose-cardamom syrup, or chilled slow-simmered rice pudding topped with pistachios.',
    dietary: 'Vegetarian',
    priceLabel: 'Price on enquiry',
  },
];

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  caption: string;
  image: string;
  alt: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'feast',
    title: 'The Royal Nagina Spread',
    category: 'Evening Dining',
    caption: 'Charcoal lamb chops, copper karahi, saffron biryani, and blistered garlic naan served family-style.',
    image: heroFeastImg,
    alt: HERO_MEDIA.alt,
  },
  {
    id: 'grill',
    title: 'Charcoal Mixed Grill Sizzler',
    category: 'Open-Flame Tandoor',
    caption: 'Smoky lamb chops, seekh kebabs, and chicken tikka boti straight from the charcoal pit.',
    image: tandooriGrillImg,
    alt: ABOUT_MEDIA.alt,
  },
  {
    id: 'halwa-puri',
    title: 'Sunday Morning Halwa Puri',
    category: 'Weekend Breakfast',
    caption: 'Crispy golden puris, saffron suji halwa, Lahori chana, and spiced aloo served from 9am Sunday.',
    image: halwaPuriImg,
    alt: WEEKEND_SPECIALS[0].alt,
  },
  {
    id: 'nihari',
    title: 'Lahori Beef Nihari',
    category: 'Slow-Cooked Heritage',
    caption: 'Overnight-braised shank in rich bone-marrow gravy garnished with ginger and green chillies.',
    image: nihariImg,
    alt: WEEKEND_SPECIALS[1].alt,
  },
  {
    id: 'paya',
    title: 'Brass Handi Lamb Paya',
    category: 'Weekend Special',
    caption: 'Traditional spiced lamb trotters simmered until velvety and topped with crispy shallots.',
    image: payaImg,
    alt: WEEKEND_SPECIALS[2].alt,
  },
  {
    id: 'haleem',
    title: 'Shahi Haleem',
    category: 'Weekend Special',
    caption: 'Hand-pounded wheat, lentils, and shredded meat finished with caramelized birista onions.',
    image: haleemImg,
    alt: WEEKEND_SPECIALS[3].alt,
  },
];

export function getCurrentOpeningStatus(): {
  isOpen: boolean;
  label: string;
  detail: string;
} {
  try {
    const now = new Date();
    const londonFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = londonFormatter.formatToParts(now);
    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
    const hourRaw = Number(parts.find((p) => p.type === 'hour')?.value ?? '12');
    const hour = hourRaw === 24 ? 0 : hourRaw;

    const isSunday = weekday === 'Sun';
    const openHour = isSunday ? 9 : 12;

    if (hour >= openHour && hour < 24) {
      return {
        isOpen: true,
        label: 'Open Now',
        detail: isSunday ? 'Serving until 12:00 AM (Sunday)' : 'Serving until 12:00 AM',
      };
    }

    return {
      isOpen: false,
      label: 'Currently Closed',
      detail: isSunday ? 'Opens at 9:00 AM today' : 'Opens at 12:00 PM today',
    };
  } catch {
    return {
      isOpen: true,
      label: 'Daily Service',
      detail: 'Mon–Sat 12pm–12am · Sun 9am–12am',
    };
  }
}
