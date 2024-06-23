
//Global Events
async function gettxt(dir) {
     const response = await fetch(dir);
     const text = await response.text();

     return text;
}

function findInArray(array, value) {
     for (let i of array) {
          if (i === value) {
               return true;
          }
     }

     return false;
}

function iclamp(value, min, max) {
     return value >= max ? max : value <= min ? min : value;
}

function sleep(ms) {
     return new Promise((resolve) => setTimeout(resolve, ms));
}

function irandom(min, max) {
     return Math.floor(Math.random() * max) + min;
}

function checkElements(param) {
     let Result = param.objs;
}

function randomList(list) {
     // Calculate chances for common

     let TotalWeight = list
          .map((r) => r.chance)
          .reduce((sum, current) => sum + current);
     let Chance = irandom(1, TotalWeight);
     let Counter = 0;

     for (let value of list) {
          Counter += value.chance;

          if (Chance <= Counter) {
               return value.name;
          }
     }
}


//Page Events
async function createText(parent, text, setting = { delay: .015 }) {

     var LastIndex = 0;
     var ObjectParent = document.getElementById(parent);

     function CreateNewP() {
          let P = document.createElement('p');
          ObjectParent.appendChild(P);

          return P
     }

     var CurrentP = CreateNewP();

     for (LastIndex; LastIndex < text.length; LastIndex++) {

          let Events = [
               {
                    prefix: '/p', execute: (p) => {
                         CurrentP = CreateNewP();
                         CurrentP.setAttribute('class', p)
                    }
               },
               {
                    prefix: '/b', execute: (e) => {
                         CurrentP.innerHTML += '</br>'
                    }
               }
          ];

          for (let e of Events) {
               if (text[LastIndex] == e.prefix[0] && text.substr(LastIndex, e.prefix.length) == e.prefix) {

                    let Param = ''
                    let SParam = LastIndex + e.prefix.length;
                    let EParam = 1;

                    if (text[SParam] == '[') {
                         while (text[SParam + EParam] != ']') {
                              EParam++;
                         }
                         Param = text.substr(SParam + 1, EParam - 1)
                    }

                    e.execute(Param);
                    LastIndex += e.prefix.length + (EParam + 1)
               }
          }

          CurrentP.innerHTML += text[LastIndex];
          await sleep(setting.delay * 1000)

     }

}