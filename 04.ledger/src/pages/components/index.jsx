import React from 'react';
import { Tag } from 'antd';
import { ICON_FONT as IconFont } from '@/const'

const RenderSubtype = props => {
  return (
    // <span className='font-13'>
    //   <IconFont type={props.subtype?.icon} className="font-18 mr-2" />
    //   {props.subtype?.text}
    //   {props.category && <Tag className='font-12 ml-1'>{props.category?.text}</Tag>}
    // </span>

    <Tag className='font-12'>
      <IconFont type={props.subtype?.icon} className="font-18 mr-2" />
      {props.category && `【${props.category?.text}】`}
      {props.subtype?.text}
    </Tag>
  )
}

export { RenderSubtype }