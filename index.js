var arrUser = []; 
// Vào then của getDataUser() phần then thêm 

// ------hàm lấy danh sách sinh viên-------
function getDataUser(){
    var promise = axios({
        method: 'GET',
        url: 'https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien',
    })
    promise
        .then(function (result) {
        console.log(result.data);
        // result.data là mãng chưa các sinh viên được lấy từ server
        arrUser = result.data;
        renderDataUser(result.data);
        })
        .catch(function (error) {
        console.log(error);
        })
}

// Chạy khi trang load lên để lấy dữ liệu
getDataUser()

// ------hàm rander lên giao diện-------
function renderDataUser(arr){
    var content = '';
    for(var i =0 ; i < arr.length ; i++){
        var sinhVien = arr[i];
        var diemTrungBinh = (sinhVien.diemToan + sinhVien.diemLy + sinhVien.diemHoa + sinhVien.diemRenLuyen) /4;
        content += `
        <tr class="table-dark" >
                <td scope="row">${sinhVien.maSinhVien}</td>
                <td scope="row">${sinhVien.tenSinhVien}</td>
                <td scope="row">${sinhVien.loaiSinhVien}</td>
                <td scope="row">${diemTrungBinh}</td>
                <td scope="row">${sinhVien.email}</td>
                <td scope="row">${sinhVien.soDienThoai}</td>
                <td>
                  <button onclick="deleteDataUser('${sinhVien.maSinhVien }')" class="btn btn-danger">Xoá</button>
                  <button onclick="getInfoUser('${sinhVien.maSinhVien}')"  class="btn btn-warning">Sửa</button>
                </td>
              </tr>
        ` 
    }
    document.querySelector(".table-group-divider").innerHTML = content;
}

// ------hàm thêm sinh viên-------
function addDataUser(){
    // Chặn reload trang
    event.preventDefault();

    // Lấy dữ liệu sinh viên
    var sinhVien = {};

    // dom tới các thẻ idinput
    var arrValue = document.querySelectorAll('form input,select');
    console.log(arrValue)

    // từng phần tử trong arrValue là 1 dom tới thẻ html, c ụ thể là dom tới input và select
    for(var i = 0; i <arrValue.length ; i++){
        var data = arrValue[i];

        // data là từng phần tử dom khi gọi querySelectorAll, vì đang dom nên có thể . tới các thuộc tính bên trong thẻ id, value,...
        console.log(data.id);
        sinhVien[data.id] = data.value;
    }
    console.log(sinhVien);
    var promise = axios({
        method: 'POST',
        url: 'https://svcy.myclass.vn/api/SinhVienApi/ThemSinhVien',
        // data giúp truyền dữ liệu lên server
        data: sinhVien,
    })
    promise
    .then(function (result) {
        console.log(result);
        // Khi gọi dữ liệu thành công, ta gọi tới server 1 lần nữa để lấy danh sách sinh viên mới
        getDataUser();
        openToasts(result.data);
    })
    .catch(function (error) {
    console.log(error);
    openToasts(error.response.data)
    })
}

// ------hàm tạo thông báo-------
function openToasts(string){
    document.querySelector(".toast-body").innerHTML = string
    // Gọi tới layout
    const toastLiveExample = document.getElementById('liveToast')
    // thêm toastBootstrap để show thông báo
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
}
 
// ------hàm xoá sinh viên-------
function deleteDataUser(maSinhVien){
    var promise = axios({
        method: 'DELETE',
        url: `https://svcy.myclass.vn/api/SinhVienApi/XoaSinhVien?maSinhVien=${maSinhVien}`,
    })
    promise
    .then(function (result) {
    console.log(result);
    getDataUser();
    openToasts(result.data)

    })
    .catch(function (error) {
    console.log(error);
    openToasts('Có lỗi xảy ra vui lòng thử lại')
    getDataUser()
    })
}

// ------hàm sửa sinh viên-------
function getInfoUser(maSV){
    var promise = axios ({
        method: 'GET',
        url: `https://svcy.myclass.vn/api/SinhVienApi/LayThongTinSinhVien?maSinhVien=${maSV}`
    })
    promise
    .then(function(result){
        var sinhVien = result.data;
        var arrFiled = document.querySelectorAll('form input, form select');
        for(var i = 0; i <arrFiled.length; i++){
            var id = arrFiled[i].id;
            arrFiled[i].value = sinhVien[id];
        }
    }).catch(function (error){
        console.log(error)
    });
}

// ------hàm cập nhập sinh viên-------
function updateInfoUser(){  
    var arrFiled = document.querySelectorAll('form input, form select');
    var sinhVien={};
    for(var i = 0; i < arrFiled.length; i++){
        // id = tenSinhVien
        var id = arrFiled[i].id;

        // arrFiled[i] là từng cái dom tới input và select
        sinhVien[id] = arrFiled[i].value;
    }
    console.log(sinhVien)
    var promise = axios({
        method: 'PUT',
        url: `https://svcy.myclass.vn/api/SinhVienApi/CapNhatThongTinSinhVien?maSinhVien=${sinhVien.maSinhVien}`,
        data: sinhVien,
    });
    promise
    .then(function(result){
        console.log(result);
        // Câph nhập thành công gọi getDataUser để lấy dữ liệu
        getDataUser();
    }).catch(function(error){
        console.log(error);
        openToasts('Có lỗi xảy ra');
    })
}
// Lưu ý button type phải là button
document.querySelector('form .btn-warning').onclick = updateInfoUser;
// Phần này chưa note
// ------Tìm kiếm sinh viên theo tên-------
function searchInfoUser(event){
    // Sau đó qua input của tìm kiếm sinh viên oninput="searchInfoUser(event)"
    // event.target ==> dom tới thẻ có sự kiện oninput
    var keyword =  event.target.value;
    // console.log(keyword.toLowerCase().trim())
    // Với những keyword nhập vào, sẽ truyển đổi là viết thường hoặc viết hoa hết
    // toLowerCase giúp chuyển đổi hoa thành thường
    // toUpperCase giúp chuyển đổi từ thường thành hoa
    // trim() giúp loại bỏ khoảng trắndg
    // sau đó tạo file util.js rồi gán vào html
    var newKeyWord = removeVietnameseTones(keyword.toLowerCase().trim())
    console.log(newKeyWord)
    // Sau đó lên trên cùng tạo mãng arrUser

    var arrFiled = [];

    for(var i = 0; i< arrUser.length ; i++){
        // arrUser ===>Từng sinh viên ==> arrUser[i].tenSinhVien chưa tên của chúng ta cần
        var tenSinhVien = removeVietnameseTones(arrUser[i].tenSinhVien.toLowerCase().trim()) ; 
        // dùng hàm include để kiểm tra keyword có khớp với hay ko
        if(tenSinhVien.includes(newKeyWord)){
            //Tìm sinh viên và thêm vào trong mãng arrFiler
            arrFiled.push(arrUser[i]);
        }
    }
    console.log(arrFiled)
    renderDataUser(arrFiled)
}
