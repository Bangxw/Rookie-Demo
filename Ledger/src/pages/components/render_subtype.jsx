/* eslint-disable react/prop-types */
import React from 'react';
import { PropTypes } from 'prop-types';
import { Select, Divider } from 'antd';
import {
  ledgerCategoryProptypes,
  ledgerSubtypesProptypes,
} from '@utils/proptypes.config';
import IconFont from '@components/iconfont';

// 根据大分类整理数据
function meraged_subtype_by_category(data) {
  const categorySubtypes = {};
  data.forEach((item) => {
    if (!categorySubtypes[item.categoryID]) categorySubtypes[item.categoryID] = [];
    categorySubtypes[item.categoryID].push(item);
  });
  return categorySubtypes;
}

// 组件：渲染普通的subtypes
export default function RenderSubtype({ subtype = {}, category = {} }) {
  return (
    <>
      <IconFont type={subtype.icon} className="font-18 mr-2" />
      {category.text && `【${category?.text}】`}
      {subtype.text}
    </>
  );
}

// 组件：按照category分类的subtypes
export function RenderSubtypesByCategory({
  ledgerSubtypes,
  ledgerCategory,
  initialValues,
  onChange,
}) {
  const mergeCategorySubtypes = meraged_subtype_by_category(ledgerSubtypes); // 整理后的小分类列表
  return (
    <Select initialvalues={initialValues} placeholder="消费类型" style={{ width: '180px' }} onChange={onChange}>
      {
        Object.keys(mergeCategorySubtypes).map((categoryID) => (
          <Select.OptGroup
            key={categoryID}
            label={
              ( // 根据category name分割展示
                <Divider orientation="left" plain className="m-0">
                  {ledgerCategory.find((item) => item.key === categoryID)?.text}
                </Divider>
              )
            }
          >
            {
              mergeCategorySubtypes[categoryID].map((subtype) => (
                <Select.Option value={subtype.key} key={subtype.key} className="font-12">
                  <RenderSubtype subtype={subtype} />
                </Select.Option>
              ))
            }
          </Select.OptGroup>
        ))
      }
    </Select>
  );
}
RenderSubtypesByCategory.propTypes = {
  ...ledgerCategoryProptypes,
  ...ledgerSubtypesProptypes,
  initialValues: PropTypes.string,
  onChange: PropTypes.func,
};
RenderSubtypesByCategory.defaultProps = {
  initialValues: '',
  onChange() { },
};
