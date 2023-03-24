import React, { useState } from 'react';

import CategoryManage from './category_manage';
import SubtypesManage from './subtypes_manage';

// Category Subtypes CRUD 管理
export default function CategorySubtypesManage() {
  const [categoryManageModal, setCategoryManageModal] = useState(false);

  return (
    <>
      <SubtypesManage
        setCategoryManageModal={setCategoryManageModal}
      />

      <CategoryManage
        categoryManageModal={categoryManageModal}
        setCategoryManageModal={setCategoryManageModal}
      />
    </>
  );
}
