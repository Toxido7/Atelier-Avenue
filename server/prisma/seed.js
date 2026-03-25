import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const womenSizes = ['XS', 'S', 'M', 'L']
const menSizes = ['S', 'M', 'L', 'XL']
const shoeSizes = ['37', '38', '39', '40', '41', '42', '43', '44']

function createVariants({ sizes, colors, skuPrefix, stockBase = 8 }) {
  return colors.flatMap((color, colorIndex) =>
    sizes.map((size, sizeIndex) => ({
      size,
      color,
      stock: stockBase + ((colorIndex + sizeIndex) % 7),
      sku: `${skuPrefix}-${color.replace(/\s+/g, '').toUpperCase()}-${String(size).replace(/\s+/g, '').toUpperCase()}`,
    })),
  )
}

function apparelVariants(skuPrefix, colors, sizes = womenSizes, stockBase = 8) {
  return createVariants({ sizes, colors, skuPrefix, stockBase })
}

function menswearVariants(skuPrefix, colors, stockBase = 9) {
  return createVariants({ sizes: menSizes, colors, skuPrefix, stockBase })
}

function footwearVariants(skuPrefix, colors, sizes = shoeSizes, stockBase = 5) {
  return createVariants({ sizes, colors, skuPrefix, stockBase })
}

function accessoryVariants(skuPrefix, colors, stockBase = 14) {
  return createVariants({ sizes: ['One Size'], colors, skuPrefix, stockBase })
}

const catalog = [
  {
    name: 'Women Dresses',
    slug: 'women-dresses',
    products: [
      {
        name: 'Fluid Satin Midi Dress',
        slug: 'fluid-satin-midi-dress',
        description: 'A softly draped midi dress with a clean neckline and understated shine for evening and occasion wear.',
        price: '129.00',
        compareAtPrice: '169.00',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: apparelVariants('WDR-FSMD', ['Black', 'Champagne']),
      },
      {
        name: 'Printed Poplin Shirt Dress',
        slug: 'printed-poplin-shirt-dress',
        description: 'A crisp shirt dress cut in airy poplin with a modern print and easy belted shape.',
        price: '98.00',
        compareAtPrice: '128.00',
        imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: apparelVariants('WDR-PPSD', ['Ivory Print', 'Blue Stripe']),
      },
    ],
  },
  {
    name: 'Women Tops',
    slug: 'women-tops',
    products: [
      {
        name: 'Draped Jersey Halter Top',
        slug: 'draped-jersey-halter-top',
        description: 'A fluid halter silhouette in soft jersey designed for evening layering and sharp tailoring.',
        price: '59.00',
        compareAtPrice: '79.00',
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: apparelVariants('WTP-DJHT', ['Chocolate', 'Ivory']),
      },
      {
        name: 'Minimal Rib Tank',
        slug: 'minimal-rib-tank',
        description: 'A close-fitting rib tank with a premium hand feel and a refined everyday finish.',
        price: '42.00',
        compareAtPrice: '56.00',
        imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: apparelVariants('WTP-MRTK', ['White', 'Taupe']),
      },
    ],
  },
  {
    name: 'Women Shirts',
    slug: 'women-shirts',
    products: [
      {
        name: 'Relaxed Cotton Poplin Shirt',
        slug: 'relaxed-cotton-poplin-shirt',
        description: 'An oversized cotton poplin shirt with clean cuffs and a polished menswear-inspired line.',
        price: '74.00',
        compareAtPrice: '96.00',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: apparelVariants('WSH-RCPS', ['White', 'Sky Blue']),
      },
      {
        name: 'Striped Volume Sleeve Shirt',
        slug: 'striped-volume-sleeve-shirt',
        description: 'A crisp striped shirt with exaggerated sleeves and a sharper fashion-forward proportion.',
        price: '82.00',
        compareAtPrice: '104.00',
        imageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: apparelVariants('WSH-SVSS', ['Blue Stripe', 'Sand Stripe']),
      },
    ],
  },
  {
    name: 'Women Pants',
    slug: 'women-pants',
    products: [
      {
        name: 'Wide Leg Tailored Trouser',
        slug: 'wide-leg-tailored-trouser',
        description: 'A fluid wide-leg trouser with front pleats and a long clean line for smart everyday dressing.',
        price: '92.00',
        compareAtPrice: '122.00',
        imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: apparelVariants('WPA-WLTT', ['Stone', 'Black']),
      },
      {
        name: 'Soft Crease Pull-On Pant',
        slug: 'soft-crease-pull-on-pant',
        description: 'A minimalist pull-on pant with a soft crease and straight cut for effortless daily wear.',
        price: '78.00',
        compareAtPrice: '102.00',
        imageUrl: 'https://images.unsplash.com/photo-1506629905607-d405b7a24c13?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: apparelVariants('WPA-SCPP', ['Charcoal', 'Olive']),
      },
    ],
  },
  {
    name: 'Women Knitwear',
    slug: 'women-knitwear',
    products: [
      {
        name: 'Soft Touch Funnel Sweater',
        slug: 'soft-touch-funnel-sweater',
        description: 'A clean funnel-neck knit with plush texture and a softly structured silhouette.',
        price: '88.00',
        compareAtPrice: '116.00',
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: apparelVariants('WKN-STFS', ['Cream', 'Heather Grey']),
      },
      {
        name: 'Merino Button Cardigan',
        slug: 'merino-button-cardigan',
        description: 'A fine merino cardigan with tonal buttons and a polished layer-ready fit.',
        price: '96.00',
        compareAtPrice: '124.00',
        imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: apparelVariants('WKN-MBCG', ['Camel', 'Black']),
      },
    ],
  },
  {
    name: 'Women Outerwear',
    slug: 'women-outerwear',
    products: [
      {
        name: 'Belted City Trench Coat',
        slug: 'belted-city-trench-coat',
        description: 'A sharply cut trench with a fluid belt and classic storm-flap detailing.',
        price: '189.00',
        compareAtPrice: '239.00',
        imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: apparelVariants('WOT-BCTC', ['Sand', 'Stone']),
      },
      {
        name: 'Textured Cropped Jacket',
        slug: 'textured-cropped-jacket',
        description: 'A cropped jacket with subtle texture and a boxy silhouette for elevated layering.',
        price: '148.00',
        compareAtPrice: '188.00',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: apparelVariants('WOT-TCJT', ['Ecru', 'Black']),
      },
    ],
  },
  {
    name: 'Women Shoes',
    slug: 'women-shoes',
    products: [
      {
        name: 'Leather Slingback Heel',
        slug: 'leather-slingback-heel',
        description: 'A refined slingback with a pointed toe and polished leather upper.',
        price: '138.00',
        compareAtPrice: '174.00',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: footwearVariants('WSH-LSBH', ['Black', 'Burgundy'], ['37', '38', '39', '40']),
      },
      {
        name: 'Minimal Ballet Flat',
        slug: 'minimal-ballet-flat',
        description: 'A rounded ballet flat with clean construction and a softly padded insole.',
        price: '96.00',
        compareAtPrice: '124.00',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: footwearVariants('WSH-MBFL', ['Cream', 'Black'], ['37', '38', '39', '40']),
      },
    ],
  },
  {
    name: 'Men T-Shirts',
    slug: 'men-tshirts',
    products: [
      {
        name: 'Heavyweight Boxy Tee',
        slug: 'heavyweight-boxy-tee',
        description: 'A premium cotton tee with a boxy cut, weightier jersey, and clean finished neckline.',
        price: '46.00',
        compareAtPrice: '60.00',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: menswearVariants('MTS-HWBT', ['White', 'Black']),
      },
      {
        name: 'Garment Dyed Pocket Tee',
        slug: 'garment-dyed-pocket-tee',
        description: 'A washed tee with a utility pocket and an easy lived-in finish.',
        price: '52.00',
        compareAtPrice: '68.00',
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: menswearVariants('MTS-GDPT', ['Olive', 'Clay']),
      },
    ],
  },
  {
    name: 'Men Shirts',
    slug: 'men-shirts',
    products: [
      {
        name: 'Relaxed Oxford Shirt',
        slug: 'relaxed-oxford-shirt',
        description: 'A modern oxford shirt with a relaxed shoulder and crisp everyday structure.',
        price: '76.00',
        compareAtPrice: '99.00',
        imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: menswearVariants('MSH-ROXS', ['White', 'Blue']),
      },
      {
        name: 'Stripe Cuban Collar Shirt',
        slug: 'stripe-cuban-collar-shirt',
        description: 'A lightweight shirt with a relaxed Cuban collar and clean vertical stripe.',
        price: '82.00',
        compareAtPrice: '108.00',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: menswearVariants('MSH-SCCS', ['Sand Stripe', 'Blue Stripe']),
      },
    ],
  },
  {
    name: 'Men Pants',
    slug: 'men-pants',
    products: [
      {
        name: 'Tapered Tailored Trouser',
        slug: 'tapered-tailored-trouser',
        description: 'A softly tapered trouser with refined construction and all-day ease.',
        price: '98.00',
        compareAtPrice: '126.00',
        imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: menswearVariants('MPA-TTTT', ['Charcoal', 'Stone']),
      },
      {
        name: 'Utility Drawstring Pant',
        slug: 'utility-drawstring-pant',
        description: 'A relaxed drawstring trouser with a utility mood and polished fabric finish.',
        price: '84.00',
        compareAtPrice: '110.00',
        imageUrl: 'https://images.unsplash.com/photo-1506629905607-653b870d14c1?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: menswearVariants('MPA-UDPT', ['Olive', 'Black']),
      },
    ],
  },
  {
    name: 'Men Denim',
    slug: 'men-denim',
    products: [
      {
        name: 'Straight Fit Rinse Jean',
        slug: 'straight-fit-rinse-jean',
        description: 'A straight denim fit in a dark rinse with a clean premium finish.',
        price: '88.00',
        compareAtPrice: '114.00',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: menswearVariants('MDN-SFRJ', ['Dark Indigo', 'Washed Black']),
      },
      {
        name: 'Relaxed Light Wash Denim',
        slug: 'relaxed-light-wash-denim',
        description: 'A looser denim silhouette with a pale wash and soft broken-in hand feel.',
        price: '92.00',
        compareAtPrice: '118.00',
        imageUrl: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: menswearVariants('MDN-RLWD', ['Light Blue', 'Mid Blue']),
      },
    ],
  },
  {
    name: 'Men Knitwear',
    slug: 'men-knitwear',
    products: [
      {
        name: 'Merino Quarter Zip Knit',
        slug: 'merino-quarter-zip-knit',
        description: 'A fine merino knit with a clean quarter zip and a sharper everyday silhouette.',
        price: '104.00',
        compareAtPrice: '136.00',
        imageUrl: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: menswearVariants('MKN-MQZK', ['Navy', 'Stone']),
      },
      {
        name: 'Textured Crew Sweater',
        slug: 'textured-crew-sweater',
        description: 'A softly textured crew neck designed for layering through cooler months.',
        price: '94.00',
        compareAtPrice: '120.00',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: menswearVariants('MKN-TCSW', ['Oat', 'Forest']),
      },
    ],
  },
  {
    name: 'Men Outerwear',
    slug: 'men-outerwear',
    products: [
      {
        name: 'Structured Wool Overcoat',
        slug: 'structured-wool-overcoat',
        description: 'A longline overcoat in brushed wool with a clean concealed closure.',
        price: '224.00',
        compareAtPrice: '279.00',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: menswearVariants('MOT-SWOC', ['Charcoal', 'Camel']),
      },
      {
        name: 'Canvas Workwear Jacket',
        slug: 'canvas-workwear-jacket',
        description: 'A functional canvas jacket with a crisp utility line and everyday versatility.',
        price: '148.00',
        compareAtPrice: '186.00',
        imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: menswearVariants('MOT-CWWJ', ['Khaki', 'Navy']),
      },
    ],
  },
  {
    name: 'Men Shoes',
    slug: 'men-shoes',
    products: [
      {
        name: 'Leather Court Sneaker',
        slug: 'leather-court-sneaker',
        description: 'A premium leather sneaker with a minimal upper and tonal sole.',
        price: '164.00',
        compareAtPrice: '204.00',
        imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: footwearVariants('MSH-LCSN', ['White', 'Bone'], ['41', '42', '43', '44']),
      },
      {
        name: 'Suede Penny Loafer',
        slug: 'suede-penny-loafer',
        description: 'A supple suede loafer with a streamlined penny strap and polished finish.',
        price: '186.00',
        compareAtPrice: '228.00',
        imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: footwearVariants('MSH-SPLF', ['Espresso', 'Taupe'], ['41', '42', '43', '44']),
      },
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    products: [
      {
        name: 'Structured Leather Tote',
        slug: 'structured-leather-tote',
        description: 'A polished tote with generous interior space and minimal hardware.',
        price: '118.00',
        compareAtPrice: '148.00',
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: accessoryVariants('ACC-SLTT', ['Black', 'Espresso']),
      },
      {
        name: 'Lightweight Modal Scarf',
        slug: 'lightweight-modal-scarf',
        description: 'A soft modal scarf designed to layer lightly through shifting seasons.',
        price: '44.00',
        compareAtPrice: '58.00',
        imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: accessoryVariants('ACC-LMSF', ['Sand', 'Charcoal']),
      },
      {
        name: 'Smooth Leather Belt',
        slug: 'smooth-leather-belt',
        description: 'A clean leather belt with a polished buckle and understated edge finishing.',
        price: '48.00',
        compareAtPrice: '64.00',
        imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        variants: createVariants({ sizes: ['80', '85', '90', '95'], colors: ['Black', 'Brown'], skuPrefix: 'ACC-SLBT', stockBase: 10 }),
      },
      {
        name: 'Angular Frame Sunglasses',
        slug: 'angular-frame-sunglasses',
        description: 'Sharp acetate sunglasses with a fashion-led silhouette and tinted lens.',
        price: '72.00',
        compareAtPrice: '94.00',
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        variants: accessoryVariants('ACC-AFSG', ['Black', 'Tortoise']),
      },
    ],
  },
]

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  for (const category of catalog) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        products: {
          create: category.products.map((product) => ({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            imageUrl: product.imageUrl,
            isFeatured: product.isFeatured,
            variants: {
              create: product.variants,
            },
          })),
        },
      },
    })
  }

  const totalProducts = catalog.reduce((sum, category) => sum + category.products.length, 0)
  console.log(`Seed completed successfully with ${catalog.length} categories and ${totalProducts} products.`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


