function CreateObj(element) {
    function getPos() {
         let coord = element.getBoundingClientRect();

         return {
              x: coord.left,
              y: coord.top,
         };
    }

    function getSize() {
         return {
              x: element.offsetWidth,
              y: element.offsetHeight,
         };
    }

    let Create = {};
    Create.obj = element;
    Create.pos = getPos();
    Create.size = getSize();
    Create.distance = {
         x: {
              min: Create.pos.x,
              max: Create.pos.x + Create.size.x,
              atM: 0,
         },
         y: {
              min: Create.pos.y,
              max: Create.pos.y + Create.size.y,
              atM: 0,
         },
    };

    return Create;
}

function DistanceMouse(objElement, mouse) {
    objElement.distance.x.atM =
         mouse.x -
         iclamp(mouse.x, objElement.distance.x.min, objElement.distance.x.max);
    objElement.distance.y.atM =
         mouse.y -
         iclamp(mouse.y, objElement.distance.y.min, objElement.distance.y.max);

    let X = objElement.distance.x.atM ** 2;
    let Y = objElement.distance.y.atM ** 2;
    let D = Math.sqrt(X + Y);

    return D;
}

function getButtons() {
    let Yes = document.getElementById("btn-yes");
    let No = document.getElementById("btn-no");

    if (Yes != null && No != null) {
         return {
              yes: CreateObj(Yes),
              no: CreateObj(No),
         };
    }

    return null;
}

function createStyle(className, settings, other) {
    var TempStyle = document.createElement("style");
    TempStyle.id = "main-temp";

    let Elements = "";

    for (let css of settings) {
         Elements += `${css.name}: ${
              other[css.name] != undefined ? other[css.name] : css.value
         }; `;
    }

    TempStyle.innerHTML = `.${className} {${Elements}}`;
    document.querySelector("head").appendChild(TempStyle);

    return {
         obj: TempStyle,
         destrory: function () {
              for (let e of document.querySelectorAll(`.${className}`)) {
                   e.classList.remove(className);
              }
              this.obj.remove();
         },
    };
}

function MainAnimation(execute, direction = "down", param = {}, setting = []) {

    let default_settings = [
         { name: "animation-duration", value: ".5s" },
         { name: "animation-fill-mode", value: "both" },
         { name: "animation-delay", value: "1.25s" },
         {
              name: "animation-name",
              value: direction == "down" ? "downscale" : "upscale",
         },
    ];

    let Debug = true;
    let ClassName = "main-temp";

    var Anim = {};
    Anim.style = createStyle(ClassName, default_settings, setting);
    Anim.obj = document.querySelector("main");

    if (direction == "up" && execute != null) {
         execute(Anim);
    }

    Anim.obj.classList.add(ClassName);

    Anim.obj.addEventListener("animationend", (anim) => {
         if (Debug) {
              Debug = false;

              const ParamEvents = {
                   listReturn: ["reverse"],
                   events: {
                        reverse: () => {
                             param.reverse = false;

                             return MainAnimation(
                                  execute,
                                  direction == "down" ? "up" : "down",
                                  param,
                                  setting
                             );
                        },
                        styleRemove: () => {
                             if (direction == "up") {
                                  Anim.style.destrory();
                             }
                        },
                        clearMain: () => {
                             if (direction == "down") {
                                  Anim.obj.innerHTML = "";
                             }
                        },
                   },
              };

              for (const [event, value] of Object.entries(param)) {
                   if (ParamEvents.events[event] && value) {
                        if (findInArray(ParamEvents.listReturn, event)) {
                             return ParamEvents.events[event]();
                        }
                        ParamEvents.events[event]();
                   }
              }

              if (direction == "down") {
                   return execute(Anim);
              }
         }
    });
}
