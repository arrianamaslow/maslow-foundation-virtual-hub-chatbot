import React from 'react'
import { ImageProps } from 'next/image'

const Image: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  return <img src={typeof src === 'string' ? src : ''} alt={alt} {...props} />
}

export default Image
