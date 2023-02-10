import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

const CreateIconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/c/font_3663002_dt44meukv34.js'],
});

export default function IconFont(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <CreateIconFont {...props} />;
}
