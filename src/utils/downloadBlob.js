// 直接下载blob文件
export function downloadBlob(data, filename) {
  if (typeof window.chrome !== "undefined") {
    // Chrome version
    var blob = new Blob([data], { type: `application/${filename.slice(filename.lastIndexOf('.'))}` }); //接收的是blob，若接收的是文件流，需要转化一下
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } else if (typeof window.navigator.msSaveBlob !== "undefined") {
    var blob = new Blob([data], { type: "application/force-download" });
    window.navigator.msSaveBlob(blob, filename);
  } else {
    // Firefox version
    var file = new File([data], filename, {
      type: `application/force-download`
    });
    window.open(URL.createObjectURL(file));
  }
}