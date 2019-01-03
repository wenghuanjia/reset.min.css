let listBox = document.getElementById('list'),
    headerBox = document.getElementById('header'),
    linkList = document.getElementsByTagName('a'),
    productList = document.getElementsByTagName('li');
~function () {
  // ->AJAX
  let productData = null,
    xhr = new XMLHttpRequest;
  xhr.open('get', './json/product.json', false);
  xhr.onreadystatechange = () => {
    xhr.readyState === 4 && xhr.status === 200 ? productData = xhr.responseText : null;
    productData ? productData = JSON.parse(productData) : null
  };
  xhr.send(null)
  // 数据绑定
  let str = ``;
  for (var i = 0; i < productData.length; i++) {
    let {title,img,price,time,hot} = productData[i];
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

~function () {
  let sortList = function(){
    // 按照价格升序排列
    // 1. 类数组，不可直接使用，需要转换为数组
    let productAry = [].slice.call(productList)// 这种借用slice方式操作元素结合或者节点集合，在ie6-8中不兼容
    console.log(productAry)
    // 2. 基于sort给所有的li按照价格进行排序
    productAry.sort((a,b)=>{
      // a：数组中的当前项
      // b：数组中的下一项
      // return a - b;// 数组当前项减去下一项,如果返回的值大于0,则a/b之间交换位置,否则小于0
      // =>A是当前LI,B是下一个LI,我们应该获取每个LI的价格，让价格相减，从而实现排序(首先数据绑定的时候，我们可以把后面需要用到的价格/日期/销量等信息存储到li的自定义属性上[在结构中显示 后期只能基于get-attribute这种模式获取到]，后期需要用到这个值的时候，我们基于自定义属性获取到即可)
      let aP = a.getAttribute('data-price'),
          bP = b.getAttribute('data-price');
          return (aP - bP) * this.flag;
    })
    // 按照排好序的数组，我们把LI重新增加到页面中
    for (let i = 0; i < productAry.length; i++) {
      let curLi = productAry[i];
      // appendChild:向容器的末尾追加新元素，但是页面中不是20个，还是原有的10个，只不过顺序改变了，这是为啥？
      listBox.appendChild(curLi)
    }
  }
  linkList[1].flag = -1;
  linkList[1].onclick = function() {
    this.flag *= -1;// 每一次点击可以让falg的值从-1与1之间来回切换
    sortList.call(this)
  }
} ()

/* 随机打乱数组
   let ary = [12,23,14,15,25,1,7,19,28];
   ary.sort((a,b)=>{
     return Math.round(Math.random()*10-5);
   })
*/
/* 
   DOM的映射机制
   页面中的HTML元素，和js中通过相关方法获取到的元素集合或者元素对象存在映射关系(一个改变另一个会跟着自动修改)

   xxx.style.color = 'red': 把xxx元素对象对应堆内存中的style属性下的color属性值修改为'red'（本质操作的是js堆内存）：但是由于DOM映射关系，页面中的标签和xxx元素对象是绑在一起的，我们修改元素对象空间的值，页面中的元素会按照最新的值进行渲染

   在元素绑定前：我们获取容器中的元素，得到一个空的元素集合，元素数据绑定后，我们不需要重新获取，DOM的映射机制会帮我们把新增加的元素映射到之前获取的空集合中，让其变为有元素的集合(但是querySelectorAll获取的集合是静态集合，不存在上述所谓的映射机制，所以基于这种方法，数据绑定完成后需要重新的获取一次才行)

   appendChild 在追加元素对象的时候，如果这个元素之前容器中已经存在，此时不是克隆一份新的追加到末尾，而是把原有的元素移动到末尾位置
*/