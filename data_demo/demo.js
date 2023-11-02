function getDataTxt(){
    var promise =axios({
        // method: phương thức sử dụng
        method: 'GET',
        // url đường dẫn tới file cần đọc
        url: "./data/data.txt",
        // responseType xác định dạng dử liệu file cần đọc
        responseType: 'text',
    })
    // Then xử lí các hành động khi gọi dữ liệu về thành công
    // catch giúp trả về lỗi khi gọi dữ liệU và các xử lí ở bên trong
    promise.then(function(result){
        console.log(result);
        // result.data giúp truy cập vào responseType của file, có thể sử dụng các phương thức getElementById, querySelector để gọi dử liệu
        var content = result.data;
        document.getElementById("loiSangNoi").innerHTML = content;
    }).catch(function(error){
        console.log(error)
        document.getElementById("loiSangNoi").innerHTML = "Đã xãy ra lỗi";
    }); 
}
getDataTxt()