import bowl1 from "../assets/bowl1.png"
import bowl2 from "../assets/bowl2.png"
import bowl3 from "../assets/bowl3.png"
import bowl4 from "../assets/bowl4.png"
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/image3.png"

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
