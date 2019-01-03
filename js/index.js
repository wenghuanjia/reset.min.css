let listBox = document.getElementById('list'),
  headerBox = document.getElementById('header'),
  linkList = document.getElementsByTagName('a'),
  productList = document.getElementsByTagName('li');
~ function () {
  let productData = null,
    xhr = new XMLHttpRequest;
  xhr.open('get', './json/product.json', false);
  xhr.onreadystatechange = () => {
    xhr.readyState === 4 && xhr.status === 200 ? productData = xhr.responseText : null;
    productData ? productData = JSON.parse(productData) : null
  };
  xhr.send(null)
  let str = ``;
  for (var i = 0; i < productData.length; i++) {
    let {
      title,
      img,
      price,
      time,
      hot
    } = productData[i];
    str += `<li data-price="${price}" data-time="${time}" data-hot="${hot}">
                <a href="javascript:;">
                    <img src="${img}" alt="">
                    <p>${title}</p>
                    <span>${price}</span>
                </a>
            </li>`
  }
  listBox.innerHTML = str
}()

~ function () {
  let sortList = function () {
    let {
      index: _index,
      flag: _flag
    } = this,
    productAry = [].slice.call(productList);
    productAry.sort((a, b) => {
      let ary = ['data-time', 'data-price', 'data-hot']
      // 获取当前点击a的索引，通过索引不同，按照不同的方式进行排序
      let aInn = a.getAttribute(ary[_index]),
        bInn = b.getAttribute(ary[_index]);
      if (_index === 0) {
        aInn = aInn.replace(/-/g, '');
        bInn = bInn.replace(/-/g, '');
      }
      return (aInn - bInn) * _flag;
    })
    for (let i = 0; i < productAry.length; i++) {
      let curLi = productAry[i];
      listBox.appendChild(curLi)
    }
  }
  // 给每一个link都绑定点击切换
  for (let i = 0; i < linkList.length; i++) {
    let curLink = linkList[i];
    curLink.index = i; // 设置自定义属性存储a的索引
    // 每一个a标签上都有一个flag，能够在点击的时候实现1--1之间的切换，点击都要执行sprt-list，同时方法中的this也都改为当前点击的a
    curLink.flag = -1;
    curLink.onclick = function () {
      for (let j = 0; j < linkList.length; j++) {
        let item = linkList[j];
        if (item != this) {
          item.flag = -1;
        }
      }
      this.flag *= -1;
      sortList.call(this)
    }
  }
}()