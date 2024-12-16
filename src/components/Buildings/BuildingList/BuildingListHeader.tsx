import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const BuildingListHeader: React.FC = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Tên tòa nhà</TableCell>
        <TableCell>Địa chỉ</TableCell>
        <TableCell>Số tầng</TableCell>
        <TableCell align="right">Thao tác</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default React.memo(BuildingListHeader);
