/*!
 *  simple-heatmap
 *  By https://github.com/dwqdaiwenqi 
 *  Github: https://github.com/dwqdaiwenqi/simple-heatmap
 *  MIT Licensed.
 */
 class Palette{
    constructor(gradient){
      this.gradient = gradient
      this.canvas = document.createElement('canvas')

      this.c = this.canvas.getContext("2d")

      this.canvas.width = 256
      this.canvas.height = 1

      let linearGradient = this.c.createLinearGradient(0, 0, this.canvas.width,0)

      Object.keys(this.gradient).forEach(k=>linearGradient.addColorStop(k, this.gradient[k]))

      this.c.fillStyle = linearGradient
      this.c.fillRect(0, 0, this.canvas.width, this.canvas.height)

      this.pixels = this.c.getImageData(0, 0, this.canvas.width, this.canvas.height).data

    }
  }

  class Cir{
    constructor([x,y,w], radius,max_alpha){
     
      this.x=x
      this.y=y
      this.max_alpha = max_alpha
      this.alpha= Math.min(w, this.max_alpha)
      this.radius=radius

    }
    render(c){
      c.save()
      c.globalAlpha = this.alpha

      c.translate(this.x,this.y)
      var gradient = c.createRadialGradient(0,0,0,0,0,this.radius)
      
      gradient.addColorStop(0, 'rgba(0,0,0,1)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = gradient

      c.beginPath()
      c.arc(0,0,this.radius,0,Math.PI*2)
      c.closePath()
      c.fill()
      c.restore()
    }
  }
  class HeatMapOuO{
    constructor(data,opt,$el){
      console.log("%c https://github.com/dwqdaiwenqi/simple-heatmap", "font-size:20px;color:aqua;")
      console.log("%c --- :)", "font-size:20px;color:aqua;")
     
      this.data =data
      this.opt = Object.assign({
        radius:20,
        alpha:1,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      },opt)
      this.$el = $el

      this.palette = new Palette(this.opt.gradient)
      
      this.canvas = document.createElement('canvas')
      $el.appendChild(this.canvas)
      this.canvas.width = this.$el.offsetWidth
      this.canvas.height = this.$el.offsetHeight

      this.context = this.canvas.getContext('2d')

      this.elements = this.data.map(([x,y,w])=>new Cir([x,y,w],  this.opt.radius,this.opt.alpha))
      
    }
    render(){
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height)

      this.elements.forEach((cir)=>{
       
        cir.render(this.context)
      })


      var data = this.context.getImageData(0,0,this.canvas.width,this.canvas.height)
      var pixels = data.data
      var colored = this.context.createImageData(data)
      var pixels2 = colored.data

      for(let i =0,len =pixels.length;i<len;i+=4 ){
        let [r,g,b,a] = [
          pixels[i],
          pixels[i+1],
          pixels[i+2],
          pixels[i+3],
        ]

        pixels2[i] = r
        pixels2[i+1] = g
        pixels2[i+2] = b
        pixels2[i+3] = a

  //       //alpha

        let idx = a/256*this.palette.canvas.width|0
        // alpha强度作为颜色映射依据
        // 颜色映射强度从调色盘中获得
        pixels2[i] = this.palette.pixels[idx*4]
        pixels2[i+1] = this.palette.pixels[idx*4+1]
        pixels2[i+2] = this.palette.pixels[idx*4+2]

      }
      this.context.putImageData(colored,0,0)

    }
  } 



customElements.define('simple-heatmap', class extends HTMLElement{
  constructor(){
    super()
 
    this.attachShadow({ mode: 'open' })
    var $sty = document.createElement('style')
    this.shadowRoot.appendChild($sty)
    $sty.textContent = `
      :host{display:inline-block;}
      /*#wrap{
        width:100%;
        height:100%;
        border:1px solid black;
        border-radius:35px;
        display:flex;
        align-items:center;
      }  
      #chart-wrap{
        height:85%;
        width:100%;
        box-sizing:border-box;
        border:1px solid black;
        border-left:none;
        border-right:none;
      }*/

      #wrap{
        width:100%;
        height:100%;
      }
      #chart-wrap{
        width:100%;
        height:100%;
      }
    `    
    var $d = document.createElement('div')
    this.shadowRoot.appendChild($d)
    $d.id = 'wrap'

    $d.innerHTML = `
      <div id="chart-wrap"></div>
    `

    this.constructor.observedAttributes.forEach(v=>{
      Object.defineProperty(this,v,{
        get(){
          return this.getAttribute(v)
        },
        set(val){
          this.setAttribute(v,val)
        }
      })
    })
  }
  static get observedAttributes () {
    return [
      'api',
      'x-data',
      'radius',
      'gradient',
      'alpha'
    ]
  }
  static loadScp(sc){
    return new Promise(resolve=>{
      var $scp = document.createElement('script')

      $scp.onload = ()=>{
        resolve($scp)
      }

      $scp.src = sc
      document.body.appendChild($scp)
    })
  }
  connectedCallback_(){
    // console.log(this.param)
    //debugger
    var $root = this.shadowRoot.querySelector('#chart-wrap')

    
    var constrain = {
      width:$root.offsetWidth,
      height:$root.offsetHeight
    }



    var api = /192/.test(location.host)?`/api/heatmap?grids=5929`:this.getAttribute('api')

    fetch(api).then(res=>res.text()).then(res=>{
      try{
        res = JSON.parse(res)
      }catch(e){console.log(e)}
          
      
        if(res.errno<=0) return console.log(res.msg)

        var per = Math.sqrt(res.result.grids)


        var [row,ceil] = [per,per]
        var [w,h] = [constrain.width,constrain.height]
      
        var heatpoints = []
        var positions = []
        for(let i = 0;i<row;i++){
          let y = i/row*h  
          for(let j=  0;j<ceil;j++){
            let x = j/ceil*w
            positions.push([x,y])
          }
        }

        heatpoints = res.result.heatpoints.map((p)=>{
          return [...positions[p.idx],p.weight]
        })


        
        let min_w,max_w
        heatpoints.forEach((p)=>{
          if(!min_w) min_w = p[2]
          if(!max_w) max_w = p[2]
          min_w = Math.min(min_w,p[2])
          max_w = Math.max(max_w,p[2])
        })
        heatpoints = heatpoints.map((p)=>{

          let w
          if(max_w===min_w){
            w = .5
          }else{
            w = (p[2]-min_w)/(max_w-min_w)
          }
          p[2]=w
          return p
        })

        console.log(`heatpoints.length:${heatpoints.length}`)

        var heat = new HeatMapOuO(heatpoints,this.param,$root)


        ;(function animate(){
          requestAnimationFrame(animate)
          heat.render()
        })()

    })

  }
  connectedCallback (){

    setTimeout(this.connectedCallback_.bind(this)) 
  }
  attributeChangedCallback (name, oldValue, newValue){
    
  }
})
