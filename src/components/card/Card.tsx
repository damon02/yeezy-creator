import React from 'react'

import { IGenericProduct, IPartPropsCSSProperties } from '../../@types/types'
import { DEFAULT_WHITE } from '../../utils/constants'
import { combineIntoCSS } from '../../utils/css'

import './Card.scss'

interface IProps {
  partProps?: IPartPropsCSSProperties
  product: IGenericProduct
  handleClick: () => void
}

const Card = (props: IProps) => {
  const { partProps, product, handleClick } = props
  const upperCSS = partProps && combineIntoCSS({ ...partProps.upper.css, saturation: 1 })

  console.log(partProps)

  return (
    <button
      className="card"
      key={product.id}
      onClick={() => handleClick()}
    >
      <div className="image">
        <div className="border-cover"/>
        {product.assets?.map((part) => {
          const partCSS = partProps 
            ? combineIntoCSS(partProps[part.id].css) 
            : combineIntoCSS({ ...DEFAULT_WHITE.values, display: 'block' })
          const variant = partProps ? partProps[part.id].variant.file : part.variants[0].file

          return (
            <img
              alt={''}
              key={`${product?.name}-${part.id}`}
              className={`card-product-layer ${part.id}`}
              style={{
                ...partCSS,
                zIndex: part.zindex,
                backgroundImage: `url(${variant})`,
              }}
            />
          )
        })}
      </div>
      <div className="product-name">{product.name}</div>
      <div className="card-bottom-border" style={{ filter: upperCSS?.filter }} />
    </button>
  )
}

export default Card