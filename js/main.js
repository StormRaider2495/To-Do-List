var toDoList = {};

toDoList.init = function(){
  var oSelf= this;
  oSelf.unfinished = {};
  oSelf.finished = {};
  var currentHeaderClicked=undefined, store={};
  oSelf.render();
  oSelf.dynamicContent();

}


toDoList.render = function(){
  var oSelf=this;
  var toDoHdrBtn = '<button class="btn btn-success hdrBtn">Add List Header</button>';
  $(".main .row .left-panel").prepend(toDoHdrBtn);
}

toDoList.dynamicContent = function(){
  var oSelf = this, i, listBox, listItm, jsonItms='';

  listBox = '<div class="listBox"><ul></ul></div>';
  $(".left-panel").append(listBox);

  listItm = '<div class="addedItems">';
  listItm+= '<ul class="listItm"></ul>';
  listItm+= '</div> <small>Click on list items to add them to the removed part</small>';
  listItm+= '<div class="removedItems"><ul class="rmvItm"></ul></div>';
  $(".right-panel").append(listItm);

    var dataUrl = "data.json",param ={}, finished={}, unfinished={};

    var myInitionJSONDataSuccessCallback =function(result){
      // alert(JSON.stringify(result));
      oSelf.finished = result.finished;
      oSelf.unfinished = result.unfinished;

      for(i in oSelf.finished){
          jsonItms += '<li>'+i+'</li>';
      }
      $(".listBox ul").append(jsonItms);
      /* ------------------ Calling the bindEvents function inside the Ajax callback function -----------------------  */
      oSelf.bindEvents();

    };

    var myInitionJSONDataErrorCallback =function(e){
      alert(e.message)
    }
    toDoList.jsonFetch(dataUrl,"GET","",myInitionJSONDataSuccessCallback,myInitionJSONDataErrorCallback);
}

toDoList.bindEvents = function(){

    var oSelf=this;
    console.log(oSelf.finished);

    $(".hdrBtn").on("click",function(){
          oSelf.addHdr();
    });

  /* ***** Event Delegation ***** */
    $(".left-panel").off("blur").on("blur","#inptHdrItm",function(event){
    var listItm = "";
    if($("#inptHdrItm").val()){
      listItm = '<li>'+$("#inptHdrItm").val()+'</li>';
      $(".listBox ul").append(listItm);
      oSelf.unfinished[""+$("#inptHdrItm").val()+""]=[]; //Creating Array for individual lists
      oSelf.finished[""+$("#inptHdrItm").val()+""]=[];
      oSelf.currentHeaderClicked =undefined;
      oSelf.currentHeaderClicked = $("#inptHdrItm").val();
    }
    $("#inptHdrItm").val("");
    });


    $(".left-panel").off("click").on("click",".listBox ul li", function(){
      var index = $(this).index();
      var text = $(this).text();

      /* ***** Re-initializing currentHeaderClicked ***** */
      oSelf.currentHeaderClicked = text;
      // console.log(toDoList.currentHeaderClicked);

      /* ***** Showing text box on click***** */
      var inpLstItms;
      inpLstItms = '<span class="form-control listName">'+text+'</span>';
      // inpLstItms +=  '<ul class="listItm"></ul>';
      inpLstItms += '<input class="form-control" id="inpLstItm" type="text" placeholder="Add a to-do...">';
      $(".listItm").empty().html(inpLstItms);

      var finListItms = '<span class="form-control listName"> Removed Items</span> <ul> </ul>';
      $(".removedItems").empty().html(finListItms);

      /* ***** Fetching items from object if they exist ***** */
      if(oSelf.unfinished[""+text+""] == 0 && oSelf.finished[""+text+""] == 0){
        console.log(index+" : "+text+" - empty")
      }
      else{

          for(i in oSelf.unfinished[""+text+""]){
            var item = '<li>'+toDoList.unfinished[""+text+""][i]+'</li>';
            $(".listItm").append(item);
          }
          for(i in oSelf.finished[""+text+""]){
            var item = '<li>'+oSelf.finished[""+text+""][i]+'</li>';
            $(".removedItems ul").append(item);
          }
      }
    });

/* ***** Adding items to right panel ****** */
    $(".right-panel").off("blur").on("blur","#inpLstItm",function(event){
    var listItm = "";
    if($("#inpLstItm").val()){
      listItm = '<li>'+$("#inpLstItm").val()+'</li>';
      $(".listItm").append(listItm);
      for(x in toDoList.unfinished){
        if(x == toDoList.currentHeaderClicked){
            toDoList.unfinished[""+x+""].push($("#inpLstItm").val());
        }
      }
    }
    $("#inpLstItm").val("");
    });

    /* ***** Adding items to completed part ***** */
    $(".right-panel").on("click",".addedItems .listItm li",function(){
      var index = $(this).index();
      // console.log(index-2);
      var text = $(this).text();
      $(this).remove();
      $(".removedItems ul").append($(this));
      // console.log($(this).text());
      toDoList.unfinished[""+toDoList.currentHeaderClicked+""].splice(index-2,1);
      toDoList.finished[""+toDoList.currentHeaderClicked+""].push(text);

    });

    /* ***** Adding items to list part ***** */
    $(".right-panel").on("click",".removedItems ul li",function(){
      var index = $(this).index();
      // console.log(index-2);
      var text = $(this).text();
      $(this).remove();
      $(".addedItems ul").append($(this));
        // console.log($(this).text());
        toDoList.finished[""+toDoList.currentHeaderClicked+""].splice(index-2,1);
        toDoList.unfinished[""+toDoList.currentHeaderClicked+""].push(text);
    });

}

/* ***** Showing input box on left panel ***** */
toDoList.addHdr = function(){
    var inptHdrItms = '<input class="form-control" id="inptHdrItm" type="text" placeholder="Enter List Topic"></input>';
    $(".hdrItems").empty().html(inptHdrItms);
}



toDoList.jsonFetch = function(url,method, param, callBackFunct, errorCallBack){
    $.ajax({
      url: url,
      data: param,
      async: false,
      beforeSend: function(){
        console.log("Before firing Ajax");
      },
      type: "GET",
      success: callBackFunct,
      error: errorCallBack,
      complete: function(){
        console.log("Once Request is completed.....Success or False");
      }
    });
};

/*
function callBackFunct(data){
  var finList,unFinList;
  finList = data.finished;
  unFinList = data.unfinished;

}

function errorCallBackFunct(){

}
*/
