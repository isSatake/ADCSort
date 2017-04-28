/*
 *  Created at 2017/04/27 by Hiroaki Satake (81724496)
 */

$(function() {
  //ADC Class
  function ADC(values, index){
    this.values = values
    this.index = index
    this.$div = $('#' + (this.index + 1))
    this.tupleSpace = []
    this.preValues = [] //2クロック前の状態
    this.timerId
    this.end = false

    this.start()
  }

  ADC.prototype.start = function(){
    var obj = this
    obj.values.sort(numSort)
    obj.draw()

    //送受信サイクルをスタート
    obj.timerId = setInterval(function(){
      obj.sendReceive()
    }, INTERVAL)
  }

  ADC.prototype.judge = function(){
    if(this.preValues.length < 3) return
    var shift = this.preValues.shift()
    if(shift == this.values){
      this.end = true
      clearInterval(this.timerId)
      console.log("end")
    }
  }

  ADC.prototype.saveState = function(){
    this.preValues.push(this.values)
  }

  ADC.prototype.sendReceive = function(){
    console.log("sendReceive")
    if(this.values.length == NUM_OF_NUM){
      this.send()
      return
    }
    this.get()
  }

  ADC.prototype.sort = function(){
    this.values.sort(numSort)
    this.saveState()
    this.judge()
    this.draw()
  }

  ADC.prototype.send = function(){
    this.sendLowest()
    this.sendHighest()
  }

  ADC.prototype.sendLowest = function (){
    if(ADCs[this.index - 1] === undefined) return
    ADCs[this.index - 1].tupleSpace.push(this.values.shift())
  }

  ADC.prototype.sendHighest = function (){
    if(ADCs[this.index + 1] === undefined) return
    ADCs[this.index + 1].tupleSpace.push(this.values.pop())
  }

  ADC.prototype.get = function(value){
    this.values.push(this.tupleSpace.shift())
    this.sort()
  }

  ADC.prototype.draw = function(){
    var obj = this
    var text = ''
    this.values.forEach(function(value, index, array){
      text = text + value + ' '
    })
    this.$div.text(text)
  }

  function numSort(a, b){
    return a - b;
  }

  //Initialize
  var NUM_OF_ADC = 2
  var NUM_OF_NUM = 5
  var INTERVAL = 1000
  var num1000 = Array.apply(null, Array(1000)).map(function(value, key) { return key + 1; })
  var ADCs = []

  for(var i = 0; i < NUM_OF_ADC; i++){
    var values = []
    while(true){
      var rand = Math.floor( Math.random() * (1000 + 1) )
      var num = num1000[rand]
      if(values.indexOf(num) == -1){
        values.push(num)
      }
      if(values.length == NUM_OF_NUM) break
    }
    ADCs[i] = new ADC(values, i)
  }
})
