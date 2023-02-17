import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { ICON_FONT_URL } from '@src/const';

const CreateIconFont = createFromIconfontCN({
  scriptUrl: [ICON_FONT_URL],
});

export default function IconFont(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <CreateIconFont {...props} />;
}
