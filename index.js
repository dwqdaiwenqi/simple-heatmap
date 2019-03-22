{
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


    // (w-min_w)/max_w-min_w

  }  
 

  



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

  //       //alpha 0-1

        let idx = a/256*this.palette.canvas.width|0
   
        pixels2[i] = this.palette.pixels[idx*4]
        pixels2[i+1] = this.palette.pixels[idx*4+1]
        pixels2[i+2] = this.palette.pixels[idx*4+2]

      }
      this.context.putImageData(colored,0,0)

    }
  }

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


  ;(function animate(){
    requestAnimationFrame(animate)
    heat.render()
  })()