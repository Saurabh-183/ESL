// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <img
      src="/logo.jpeg"
      className='w-full h-16 object-contain'
    />
  )
}

export default Logo
