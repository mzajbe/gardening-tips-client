/* eslint-disable prettier/prettier */
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface Post {
  _id: string;
  title: string;
  content: string;
  categories: string[];
  images: string[];
  createdAt: string;
  postId: any;
  data: any;
  isGroupPost?: boolean;
}
