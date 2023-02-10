import React from 'react';
import { Tag } from 'antd';
import { PropTypes } from 'prop-types';
import IconFont from '@components/iconfont';

function RenderSubtype({ subtype, category }) {
  return (
    <Tag className="font-12" color="blue">
      <IconFont type={subtype?.icon} className="font-18 mr-2" />
      {category && `【${category?.text}】`}
      {subtype?.text}
    </Tag>
  );
}

RenderSubtype.propTypes = {
  subtype: PropTypes.isRequired,
  category: PropTypes.isRequired,
};

export default RenderSubtype;
