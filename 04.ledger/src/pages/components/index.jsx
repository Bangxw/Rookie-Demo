import React from 'react';
import { Tag } from 'antd';
import { ICON_FONT as IconFont } from '@/const';

function RenderSubtype(props) {
  const { subtype, category } = props;
  return (
    <Tag className="font-12" color="blue">
      <IconFont type={subtype?.icon} className="font-18 mr-2" />
      {category && `【${category?.text}】`}
      {subtype?.text}
    </Tag>
  );
}

export default RenderSubtype;
