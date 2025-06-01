import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Spin, Empty, message, Pagination } from "antd";
import VoucherCard from "./VoucherCard";
import fetchUtils from "../../utils/fetchUtils";

const VoucherList = ({ selectedStores, selectedCategories }) => {
  const [vouchers, setVouchers] = useState([]); // Danh sách voucher chung từ /voucher
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  // State để lưu trữ thông tin chi tiết về các voucher người dùng đã lưu
  // Mỗi phần tử sẽ có dạng: { voucherId: "ID_VOUCHER_GOC", isUsed: boolean, savedUserVoucherId: "ID_CUA_USER_VOUCHER_INSTANCE" }
  const [mySavedVouchersMap, setMySavedVouchersMap] = useState(new Map());

  const fetchAllVouchers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
    });
    if (selectedStores.length > 0) params.append("storeId", selectedStores.join(","));
    if (selectedCategories.length > 0) params.append("category", selectedCategories.join(","));

    try {
        const data = await fetchUtils.get(`/voucher?${params.toString()}`, false);
        setVouchers(data.vouchers || []);
        setTotal(data.pagination?.total || data.total || 0); // Sửa lại cách lấy total nếu cần
    } catch (err) {
        message.error("Không thể tải danh sách voucher!");
        setVouchers([]);
        setTotal(0);
    } finally {
        setLoading(false);
    }
  }, [selectedStores, selectedCategories, page, pageSize]);


  const fetchMySavedVouchers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMySavedVouchersMap(new Map()); // Nếu không đăng nhập, không có voucher đã lưu
      return;
    }
    try {
      // API này nên trả về danh sách các user_voucher instances, bao gồm voucherId (tham chiếu đến Voucher gốc) và isUsed
      const response = await fetchUtils.get("/user/storage/voucher/vouchers", true);
      if (response.success && Array.isArray(response.data)) {
        const newMap = new Map();
        response.data.forEach(savedVoucher => {
          // Giả sử API trả về `voucherId` là ID của voucher gốc và `_id` là ID của bản ghi user_voucher
          const originalVoucherId = savedVoucher.voucherId?.$oid || savedVoucher.voucherId || savedVoucher._id; // Lấy ID của voucher gốc
          const userVoucherInstanceId = savedVoucher._id?.$oid || savedVoucher._id; // ID của bản ghi trong User.vouchers

          // Nếu một voucher gốc có nhiều bản ghi đã lưu (ví dụ, săn lại sau khi dùng),
          // chúng ta cần quyết định logic ở đây. Hiện tại, chỉ cần biết nó đã lưu và có bản nào đã dùng không.
          // Để đơn giản, ta có thể lưu trạng thái "ít nhất một bản chưa dùng" hoặc "tất cả đã dùng".
          // Hoặc, ta chỉ quan tâm đến việc có tồn tại bản ghi chưa dùng hay không.

          // Logic này sẽ ưu tiên hiển thị "Đã Lưu" nếu có ít nhất 1 bản chưa dùng.
          // Nếu tất cả các bản đã lưu của voucherId này đều isUsed=true, thì ta coi như nó "đã dùng" và có thể cho săn lại.
          if (newMap.has(originalVoucherId)) {
            // Nếu đã có key này, chỉ cập nhật isUsed nếu bản mới này chưa dùng
            if (!savedVoucher.isUsed) {
              newMap.set(originalVoucherId, { isUsed: false, savedUserVoucherId: userVoucherInstanceId });
            }
          } else {
            newMap.set(originalVoucherId, { isUsed: savedVoucher.isUsed, savedUserVoucherId: userVoucherInstanceId });
          }
        });
        setMySavedVouchersMap(newMap);
      } else {
        setMySavedVouchersMap(new Map());
      }
    } catch (error) {
      console.error("Error fetching saved vouchers:", error);
      setMySavedVouchersMap(new Map());
    }
  }, []);


  // Fetch danh sách voucher chung và voucher đã lưu khi component mount hoặc filter thay đổi
  useEffect(() => {
    fetchAllVouchers();
  }, [fetchAllVouchers]); // fetchAllVouchers đã có dependency của nó

  useEffect(() => {
    fetchMySavedVouchers();
  }, [fetchMySavedVouchers]); // fetchMySavedVouchers chạy 1 lần


  // Callback khi một voucher được lưu thành công từ VoucherCard
  const handleVoucherSaved = useCallback((voucherCampaignId) => {
    // Sau khi lưu, fetch lại danh sách voucher đã lưu để cập nhật trạng thái isUsed và savedUserVoucherId
    fetchMySavedVouchers();
    // Không cần cập nhật mySavedVouchersMap trực tiếp ở đây nữa, fetchMySavedVouchers sẽ làm
  }, [fetchMySavedVouchers]);


  return (
    <Spin spinning={loading} tip="Đang tải vouchers...">
      <Row gutter={[24, 24]}>
        {vouchers.length === 0 && !loading && (
          <Col span={24} style={{ textAlign: 'center', marginTop: '50px' }}>
            <Empty description="Không có voucher nào phù hợp với lựa chọn của bạn." />
          </Col>
        )}
        {vouchers.map((voucher) => {
          // voucher._id ở đây là ID của Voucher gốc (campaign)
          const savedStatus = mySavedVouchersMap.get(voucher._id);
          // isSaved: true nếu voucher đã được lưu VÀ phiên bản đó CHƯA được sử dụng.
          // Nếu tất cả các phiên bản đã lưu của voucher này đều isUsed=true, thì isSaved sẽ là false (cho phép săn lại).
          const isEffectivelySaved = savedStatus ? !savedStatus.isUsed : false;

          return (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={voucher._id}>
              <VoucherCard
                voucher={voucher} // Thông tin voucher gốc
                isSaved={isEffectivelySaved} // Trạng thái để hiển thị nút "Đã Lưu" hoặc "Lưu Voucher"
                // onSaveSuccess sẽ được gọi với voucher._id (ID của voucher gốc)
                onSaveSuccess={() => handleVoucherSaved(voucher._id)}
              />
            </Col>
          );
        })}
      </Row>
      {total > 0 && (
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            pageSizeOptions={[12, 24, 36, 48]}
            onChange={(p, ps) => {
              setPage(p);
              if (ps) setPageSize(ps);
            }}
            showTotal={(totalItems, range) => `${range[0]}-${range[1]} của ${totalItems} voucher`}
          />
        </div>
      )}
    </Spin>
  );
};

export default VoucherList;