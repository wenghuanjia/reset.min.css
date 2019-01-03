// 基于高级单例模式完成业务逻辑开发
let productRender = (function () {
  let productData = null;
  let productBox = document.getElementById('productBox');
  let headerBox =document.getElementById('headerBox');
  let linkList = headerBox.getElementsByTagName('a');
  let productList = productBox.getElementsByTagName('li');
  // 自执行函数形成的私有作用域不销毁('闭包')
  // 1. 里面的方法和变量等和外界不冲突
  // 2. 里面创建的值也不销毁
  // ajax获取数据
  let getData = function () {
    let xhr = new XMLHttpRequest;
    xhr.open('get', './json/product.json', false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        productData = JSON.parse(xhr.responseText);
      }
    }
    xhr.send(null)
  }
  // es6模板字符串完成数据绑定
  let bindHTML = function () {
    let str = ``;
    productData.forEach(({
      title,
      price,
      hot,
      time,
      img
    }, index) => {
      // es6模板字符串${}中存放的是js代码
      str += `<li data-time="${time}" data-hot="${hot}" data-price="${price}">
      <a href="javascript:;">
        <img src="${img}" alt="">
        <p title="${title}">${title}</p>
        <span>￥${price}</span>
        <span>时间：${time}</span>
        <span>热度：${hot}</span>
      </a>
    </li>`
    productBox.innerHTML = str;
    });
  }
  let bindClick = function() {
    [].forEach.call(linkList,(curLink,index)=>{
      curLink.flag = -1;
      curLink.onclick = function() {
        this.flag *= -1;
        let ary = ['data-time','data-price','data-hot'];
        productList = [].slice.call(productList);
        // 将li进行排序
        productList.sort((a,b)=>{
          let aInn = a.getAttribute(ary[index]);
          let bInn = b.getAttribute(ary[index]);
          if (index === 0) {
            aInn = aInn.replace(/-/g,'');
            bInn = bInn.replace(/-/g,'');
          }
          return (aInn - bInn) * this.flag;
        })
        // 文档碎片的方式来减少DOM回流或者重绘导致的性能消耗过大问题
        let frg = document.createDocumentFragment();
        productList.forEach(curLi => {
          frg.appendChild(curLi);
        })
        productBox.appendChild(frg);
        frg = null;
      }
    })
  }
  return {
    init: function () {
      getData();
      bindHTML();
      bindClick();
    }
  }
})()
productRender.init();
/* 
  DOM的回流(reflow)和重绘(repaint)
  1. 计算DOM结构（dom tree）
  2. 加载css
  3. 生成渲染树（render tree），渲染树是和样式相关的
  4. 浏览器基于GPU（显卡）开始按照render tree 画页面

  重绘：当某一个DOM元素样式更改（位置没变只是样式更改，例如：颜色变为红色），浏览器会重新渲染这个元素
  box.style.color = 'red'
  // ...
  box.style.fontSize = '16px'
  上面的操作触发了两次重绘，性能上有所消耗，真实项目中为了优化这个性能，我们最好一次性把需要修改的样式搞定，例如：.xxx {
    color: 'red',
    fontSize: '16px'
  }
  box.className = 'xxx'

  回流：当DOM元素的结构或者位置发生改变（删除、增加、改变位置，改变大小...）都会引发回流，所谓回流，就是浏览器抛弃原有计算的结构和样式，重新进行DOM tree或者render tree，非常消耗性能

  基于文档碎片（虚拟内存中开辟的一个容器）可以解决这个问题，每当创建一个li，我们首先把他存放到文档碎片中（千万不要放到页面中，避免回流），当我们把需要的元素都创建完成，并且都添加到文档碎片中，在统一把文档碎片放到页面中（只会引发一次回流）
  document.createDocumentFragment()// 创建文档碎片容器

  += str 是指把原有容器中的结构都以字符串的方式获取到，然后和新的str字符串进行拼接，最后统一再插入到原有的容器中；
  = str 是指用新的字符串替换原有的结构

  字符串拼接的方式在理论上性能要低于动态的dom操作，因为浏览器还要将字符串再转换

  分离读写（浏览器自带---新版本浏览器为了减少DOM回流或者重绘带来过多的性能消耗而定义的机制）
  [引发两次回流]
  box.style.top = '100px';
  console.log(box.style.top)
  box.style.top = '100px';
  [引发一次回流]
  box.style.top = '100px';
  box.style.top = '100px';
  console.log(box.style.top)
*/