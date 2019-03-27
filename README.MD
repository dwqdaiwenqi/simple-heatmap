## 手撸一个heatmap


### 用法

```html
<!-- ... -->
<script src="//static.xyimg.net/cn/static/fed/common/js/simple-heatmap.js?2"></script>
<!-- ... -->
```
```js
    var heatpoints = [...Array(500)].map(()=>{
      return [Math.random()*500,Math.random()*500,Math.random()*300]
    })
    
    let min_w,max_w
    heatpoints.forEach((p)=>{
      if(!min_w) min_w = p[2]
      if(!max_w) max_w = p[2]
      min_w = Math.min(min_w,p[2])
      max_w = Math.max(max_w,p[2])
    })
    heatpoints = heatpoints.map((p)=>{
      let w = (p[2]-min_w)/(max_w-min_w)
      p[2] = w
      return p
    })
    
   var heat = new HeatMapOuO(heatpoints,{
    gradient:{
      0: "#0ff",
      .2: "#0f0",
      .4: "#ff0",
      1: "#f00",
    },
    radius:30,
    alpha:.6
  },document.body)
  
  heat.render()
    
```
### 参考 
http://www.cnblogs.com/fuckgiser/p/6424099.html

https://github.com/dntzhang/wechart/blob/master/packages/heatmap/src/index.js
