// (function() {
//     var pixRatio = 1 / window.devicePixelRatio;
//     // document.write('<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=' + pixRatio + ',minimun-scale=' + pixRatio + ',maximun-scale=' + pixRatio + '" />');
//     var html = document.documentElement;
//     var hWidth = html.getBoundingClientRect().width;
//     html.style.fontSize = hWidth / 15 + 'px';
// })()

(function() {
    remLayout();

    function remLayout() {
        var w = document.documentElement.clientWidth;
        w = w > 768 ? 768 : w;
        w = w <= 320 ? 320 : w;
        document.documentElement.style.fontSize = w / 7.5 + 'px';
    }
    window.addEventListener('resize', function() {
        remLayout();
    }, false);
}())