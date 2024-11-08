/* eslint-disable prettier/prettier */
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface Post {  
  _id: string; // Unique identifier for the post  
  title: string; // Title of the post  
  content: string; // Content of the post  
  categories: string[]; // Array of categories  
  images: string[]; // Array of image URLs  
  createdAt: string; // Creation date in ISO format  
  postId:any;
  data:any;
}
