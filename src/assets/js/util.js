let util = {
  //截取url 参数
  getUrlParam(name) {
    var result = "";
    var index = window.location.href.indexOf('?');
    var searchArr = window.location.href.slice(index+1).split("&");
    searchArr.map(function (item) {
      var arr = item.split("=");
      if (arr[0] == name) {
        result = decodeURIComponent(arr[1]);
      }
    });
    return result
  },
}
export default util;
