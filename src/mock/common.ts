import { PageVoType } from '@/types/common';

export const defaultPageVoMock: () => PageVoType = () => ({
    currentPageNo: 0,
    pageSize: 20,
    totalCount: 0,
    totalPageCount: 0
});
