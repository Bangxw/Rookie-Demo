import React from 'react';
import { Tag } from 'antd';
import { ICON_FONT as IconFont } from '@/const'

const RenderSubtype = props => {
  return (
    <Tag className='font-12' color="blue">
      <IconFont type={props.subtype?.icon} className="font-18 mr-2" />
      {props.category && `【${props.category?.text}】`}
      {props.subtype?.text}
    </Tag>
  )
}

export { RenderSubtype }