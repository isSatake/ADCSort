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
    this.timer
    this.end = false
  }

  ADC.prototype.start = function(){
    this.values.sort(numSort)
    this.draw()
    this.exchange()
  }

  ADC.prototype.judge = function(){
    if(this.lowerHasHigher() || this.higherHasLower()){
      this.exchange()
      return
    }
    this.end = true
    clearTimeout(this.timer)
    console.log("end @ P" + (this.index + 1))
  }

  ADC.prototype.lowerHasHigher = function(){
    if(!this.hasLower()) return false
    var lowerValues = ADCs[this.index - 1].values
    if(lowerValues[NUM_OF_NUM - 1] > this.values[0]) return true
    return false
  }

  ADC.prototype.higherHasLower = function(){
    if(!this.hasHigher()) return false
    var higherValues = ADCs[this.index + 1].values
    if(higherValues[0] < this.values[NUM_OF_NUM - 1]) return true
    return false
  }

  ADC.prototype.exchange = function(){
    console.log("exchange")
    var obj = this
    if(obj.values.length == NUM_OF_NUM){
      obj.send()
    }else{
      obj.get()
    }
    if(this.end) return
    this.timer = setTimeout(function(){
      obj.exchange()
    }, INTERVAL)
  }

  ADC.prototype.sort = function(){
    console.log("sort")
    this.values.sort(numSort)
    this.draw()
  }

  ADC.prototype.send = function(){
    console.log("send")
    this.sendLowest()
    this.sendHighest()
  }

  ADC.prototype.hasLower = function(){
    return ADCs[this.index - 1] !== undefined
  }

  ADC.prototype.hasHigher = function(){
    return ADCs[this.index + 1] !== undefined
  }

  ADC.prototype.sendLowest = function (){
    if(!this.hasLower()) return
    ADCs[this.index - 1].tupleSpace.push(this.values.shift())
  }

  ADC.prototype.sendHighest = function (){
    if(!this.hasHigher()) return
    ADCs[this.index + 1].tupleSpace.push(this.values.pop())
  }

  ADC.prototype.get = function(value){
    this.values.push(this.tupleSpace.pop())
    if(this.index != 0 && this.index != (NUM_OF_ADC - 1)) this.values.push(this.tupleSpace.pop())
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
  var NUM_OF_ADC = 10
  var NUM_OF_NUM = 10
  var INTERVAL = 100
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

  for(var i = 0; i < NUM_OF_ADC; i++){
    ADCs[i].start()
  }
})
