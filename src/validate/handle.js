// 处理所在区域重复问题
export function handleRepeat(province, city, county) {
    if (province == city && province == county) {
        return province;
    } else if (province == city) {
        return province + county;
    } else if (city == county) {
        return province + city;
    } else {
        return province + city + county;
    }
}
