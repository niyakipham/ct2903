// =====================================================================
// ✨ MINH TRANG — HỘP CÁT KIỂM THỬ BẢO MẬT DOM (DOM PENTESTING SANDBOX)
// =====================================================================

// ---------------------------------------------------------------------
// 1. SHADOWING: ĐÓNG BĂNG THUỘC TÍNH (Thuộc tính luôn trả về False/Visible)
// ---------------------------------------------------------------------
try {
    Object.defineProperties(document, {
        'hidden': { value: false, writable: false, configurable: true },
        'visibilityState': { value: 'visible', writable: false, configurable: true }
    });
    console.log("%c[1] SHADOWING: Đã đóng băng trạng thái hiển thị (visibilityState).", "color: #B026FF;");
} catch (e) {
    console.log("%c[1] SHADOWING LỖI: Thuộc tính đã bị khóa bởi hệ thống trước đó!", "color: red;");
}

// ---------------------------------------------------------------------
// 2. MONKEY PATCHING: TIÊM MÀNG LỌC VÀO API GỐC
// ---------------------------------------------------------------------
const nativeAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Danh sách đen các sự kiện mà hệ thống thi thường dùng để bắt lỗi
    const blacklist = ['blur', 'visibilitychange', 'mouseleave', 'mouseout', 'focusout'];
    
    if (blacklist.includes(type)) {
        console.log(`%c[2] MONKEY PATCHING: Đã chặn thành công cảm biến theo dõi -> ${type}`, "color: #00D1F5;");
        return; // Chặn đứng, không cho phép đăng ký sự kiện này
    }
    
    // Nếu là sự kiện bình thường (click, scroll), cho phép đi qua
    return nativeAddEventListener.call(this, type, listener, options);
};

// ---------------------------------------------------------------------
// 3. EVENT CAPTURING: BÓP NGHẸT DÒNG CHẢY SỰ KIỆN TỪ CAO NHẤT
// ---------------------------------------------------------------------
// Cờ { capture: true } giúp hàm này đón lõng sự kiện trước mọi element khác
const killEvent = function(e) {
    e.stopImmediatePropagation();
    console.log(`%c[3] EVENT CAPTURING: Sự kiện ${e.type} đã bị triệt tiêu từ cấp Window!`, "color: #2A2A4A; background: #E0E0FF; padding: 2px;");
};

// Đăng ký đón lõng các sự kiện làm mờ và mất chuột
window.addEventListener('blur', killEvent, { capture: true });
window.addEventListener('mouseout', killEvent, { capture: true });

console.log("%c[✨] TẢI MÃ HOÀN TẤT: KHÔNG GIAN DOM ĐÃ BỊ KIỂM SOÁT!", "color: #0F0F23; background: #00D1F5; font-weight: bold; padding: 5px;");
