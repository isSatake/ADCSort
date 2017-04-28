/*
 *  Created at 2017/04/27 by Hiroaki Satake (81724496)
 */

//TODO 状態の管理がおかしい。2クロック前の状態と比べる根拠は？
/*

初期化
↓
start()
  draw()

receive()
  Array.push()
  sort()

sort()
  save()
  judge()
  draw()

draw()
  send()

send()
  Array.pop()/push()

send()より先にreceive()することがあるかもしれない
1.send()したかどうかフラグを立てて、送信側でポーリングする？
  初回は無条件で送る
2.exchange()を作る
  送信/受信を必ず同時にやる
3.送受信の処理を1本のキューでやる
  実行順が狂わないようにする

*/
$(function() {
  //ADC Class
  function ADC(values, index){
    this.values = values
    this.index = index
    this.$div = $('#' + (this.index + 1))
    this.preValues = [] //2クロック前の状態
    this.end = false

    this.start()
  }

  ADC.prototype.start = function(){
    this.values.sort(numSort)
    this.draw()
  }

  ADC.prototype.judge = function(){
    if(this.preValues.length < 2) return
    var shift = this.preValues.shift()
    if(shift == this.values){
      this.end = true
      console.log("end")
    }
  }

  ADC.prototype.saveState = function(){
    this.preValues.push(this.values)
  }

  ADC.prototype.send = function(){
    if(this.end) return
    this.sendLower()
    this.sendHigher()
  }

  ADC.prototype.sort = function(){
    this.values.sort(numSort)
    this.saveState()
    this.judge()
    this.draw()
  }

  ADC.prototype.sendLower = function (){
    if(ADCs[this.index - 1] === undefined) return
    ADCs[this.index - 1].receive(this.values.shift()) //minimum
  }

  ADC.prototype.sendHigher = function (){
    if(ADCs[this.index + 1] === undefined) return
    ADCs[this.index + 1].receive(this.values.pop()) //maximum
  }

  ADC.prototype.receive = function(value){
    this.values.push(value)
    this.sort()
  }

  ADC.prototype.draw = function(){
    var obj = this
    var text = ''
    this.values.forEach(function(value, index, array){
      text = text + value + ' '
    })
    this.$div.text(text)
    setTimeout(function(){
      obj.send()
    }, 1000)
  }

  function numSort(a, b){
    return a - b;
  }

  //Initialize
  var NUM_OF_ADC = 2
  var NUM_OF_NUM = 3
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
