import bowl1 from "../assets/bowl1.png"
import bowl2 from "../assets/bowl2.png"
import bowl3 from "../assets/bowl3.png"
import bowl4 from "../assets/bowl4.png"
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/image3.png"
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import XIcon from '@mui/icons-material/X';
import { type SvgIconComponent } from "@mui/icons-material";

interface header {
  name:string
  to:string
}

interface BowlItem {
  title: string;
  subTitle: string;
  price: string;
  image: string;
}

interface slider {
  title1 : string;
  title2 : string;
  image : string
}

interface socialMedia {
  icons : SvgIconComponent
}

export const headerItem : header[] = [
  {
    name:"Home",
    to:"/home"
  },
  {
    name:"Menu",
    to:"/menu"
  },
  {
    name:"About Us",
    to:"/about"
  },
  {
    name:"Contact",
    to:"/contact"
  },
]


export const BowlItems: BowlItem[] = [
  {
    title: "Cocoa Fusion",
    subTitle: "with Natural Ingredients",
    price: "749",
    image: bowl4,
  },
  {
    title: "Veggie Medley",
    subTitle: "with Fresh Veggies",
    price: "449",
    image: bowl2,
  },
  {
    title: "Saalmon Bowl",
    subTitle: "with Fresh Salmon",
    price: "349",
    image: bowl3,
  },
  {
    title: "Tokyo Teriyaki",
    subTitle: "with Glazed Chicken",
    price: "949",
    image: bowl1,
  },
];



export const sliderData: slider[] = [
    {
      title1: "The essence of India,",
      title2: "plated perfectly.",
      image: image1,
    },
    {
      title1: "Where tradition",
      title2: "meets taste.",
      image: image2,
    },
    {
      title1: "Desserts that steal",
      title2: "the show.",
      image: image3,
    },
  ];


  export const socialMedias : socialMedia[]= [
    {
      icons : InstagramIcon
    }, 
    {
      icons : FacebookIcon
    },
    {
      icons : TwitterIcon
    },
    {
      icons : XIcon
    }
  ] 


  // import { useState, useRef, useEffect } from 'react';

// const useLazyRender = (items, preloadCount = 3) => {
//   const [visibleItems, setVisibleItems] = useState(new Set());
//   const [preloadedItems, setPreloadedItems] = useState(new Set());
//   const itemRefs = useRef(new Map());

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const target = entry.target as HTMLElement;
//           const itemId = target.dataset.id;

//           if (itemId) {
//             if (entry.isIntersecting) {
//               setVisibleItems((prev) => {
//                 const newSet = new Set(prev).add(itemId);

//                 // Find index of current item
//                 const currentIndex = items.findIndex(
//                   (item, idx) => (item.id || idx.toString()) === itemId,
//                 );

//                 // Preload items before and after
//                 if (currentIndex !== -1) {
//                   const newPreloadSet = new Set();

//                   // Preload previous N items
//                   for (let i = 1; i <= preloadCount; i += 1) {
//                     const preloadIndex = currentIndex - i;
//                     if (preloadIndex >= 0) {
//                       const preloadId =
//                         items[preloadIndex].id || preloadIndex.toString();
//                       newPreloadSet.add(preloadId);
//                     }
//                   }

//                   // Preload next N items
//                   for (let i = 1; i <= preloadCount; i += 1) {
//                     const preloadIndex = currentIndex + i;
//                     if (preloadIndex < items.length) {
//                       const preloadId =
//                         items[preloadIndex].id || preloadIndex.toString();
//                       newPreloadSet.add(preloadId);
//                     }
//                   }

//                   setPreloadedItems(newPreloadSet);
//                 }

//                 return newSet;
//               });
//             } else {
//               setVisibleItems((prev) => {
//                 const newSet = new Set(prev);
//                 newSet.delete(itemId);
//                 return newSet;
//               });
//             }
//           }
//         });
//       },
//       { threshold: 0.1, rootMargin: '300px 0px' },
//     );

//     itemRefs.current.forEach((node) => {
//       if (node) observer.observe(node);
//     });

//     return () => observer.disconnect();
//   }, [items, preloadCount]);

//   // Determine if an item should be rendered (visible or preloaded)
//   const shouldRender = (itemId) =>
//     visibleItems.has(itemId) || preloadedItems.has(itemId);

//   return { shouldRender, itemRefs };
// };

// export default useLazyRender;
 