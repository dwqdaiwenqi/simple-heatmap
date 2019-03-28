## 手撸一个heatmap


### 用法

#### html
```html
<!-- ... -->
<script src="//static.xyimg.net/cn/static/fed/common/js/simple-heatmap.js?2"></script>
<!-- ... -->
```
#### 
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
#### Web Component

```html
  <style>
    simple-heatmap{
      /* display: block;
      width:340px;
      height:770px;
      margin:0 auto; */
      display: block;
      width:100%;
      height:100%;
      margin:0 auto;
    }
  </style>
  <simple-heatmap id="hmap" api="//www.xy.com/api/heatmaps/?grids=5929"></simple-heatmap>
  <script>
    let $hmap = document.querySelector('#hmap')
    $hmap.param = {
      radius:20,
      alpha:.3,
      // gradient:{
      //   .4: 'blue',
      //   .6: 'cyan',
      //   .7: 'lime',
      //   .8: 'yellow',
      //   .0: 'red'
      // }
      gradient:{
        .4: 'blue',
        .6: 'cyan',
        .7: 'lime',
        .8: 'yellow',
        1.0: 'red'
      }
    }
  </script>
```
### 参考 
http://www.cnblogs.com/fuckgiser/p/6424099.html

https://github.com/dntzhang/wechart/blob/master/packages/heatmap/src/index.js
