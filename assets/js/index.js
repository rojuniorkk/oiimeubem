var Clicked = false;
var Buttons = getButtons();

var BBackground = document.getElementById('background-black');
var ImageView = document.getElementById('image-view');

var LastProxButton = '';
var ProxImage = '';




const INDEX_EVENTS = {
    RETURN_DEFAULT: (FILTER = null) => {

        const DEFAULT_VALUES = [
            {
                index: '#image-view', types: {
                    style: {
                        opacity: 0,
                    }
                }
            },
            {
                index: '#image-dog', types: {
                    style: {
                        'animation-duration': '5s',
                    }
                }
            },
            {
                index: '#background-black', types: {
                    style: {
                        opacity: 0,
                    }
                }
            },
            {
                index: '.no-view', types: {
                    style: {
                        opacity: 1,
                    }
                }
            },
        ]


        try {
            for (let SETT of DEFAULT_VALUES) {
                let QUERY = document.querySelectorAll(SETT.index)

                for (const [TYPE, PROPS] of Object.entries(SETT.types)) {
                    for (const [PROP, VALUE] of Object.entries(PROPS)) {

                        if (FILTER == null || (FILTER.TYPE == 'SELECT' && findInArray(FILTER.LIST, SETT.index)) || (FILTER.TYPE == 'IGNORE' && !findInArray(FILTER.LIST, SETT.index))) {
                            QUERY.forEach((ELEMENT) => {
                                ELEMENT[TYPE][PROP] = VALUE;
                            })
                        } else {
                            continue
                        }


                    }
                }
            }
        } catch (error) {
            console.log(`RETURN_DEFAULT_VALUE : ERROR - ${error}`)
        }
    },

    CHARGE_IMAGE(NAME) {
        ImageView.setAttribute('src', `./assets/image/${NAME}.png`);
    },

    GET_RANDOM_IMAGE: (TYPE, CHARGE = false) => {

        const LIST_CHANCE = {
            yes: [
                { name: 'namorados', chance: 50 },
                { name: 'cat-te-amo', chance: 50 },
                { name: 'coracao-emoji', chance: 50 },
                { name: 'beijo-amor', chance: 50 },
            ],
            no: [
                { name: 'triste-1', chance: 50 },
                { name: 'triste-2', chance: 50 },
                { name: 'triste-3', chance: 50 },
            ]
        }

        let RESULT = randomList(LIST_CHANCE[TYPE]);

        if (CHARGE) {
            INDEX_EVENTS.CHARGE_IMAGE(RESULT);
        }

        return RESULT;
    }
}



for (const [KEY, BUTTON] of Object.entries(Buttons)) {
    BUTTON.obj.addEventListener('click', () => {
        if (!Clicked) {
            Clicked = true;

            for (const CHILD of BUTTON.obj.parentElement.children) {
                if (CHILD == BUTTON.obj) continue;

                // CHILD.style.display = 'none'
            }

            BUTTON.obj.innerHTML = 'Siimm!!';
            BUTTON.obj.style.animationName = 'jumping';
            BUTTON.obj.style.animationDuration = '.35s';
            BUTTON.obj.classList.add(['a-repeat'])

            document.getElementById('image-dog').style.animationDuration = '.15s'

            INDEX_EVENTS.GET_RANDOM_IMAGE('yes', true)
            INDEX_EVENTS.RETURN_DEFAULT({
                TYPE: 'IGNORE',
                LIST: ['#image-view', '#image-dog'],
            })

            MainAnimation((e) => {
                $('#fake-main').load('./assets/includes/pedido.html')
            }, "down", {
                reverse: true,
            })
        }
    })
}

window.addEventListener('mousemove', (mouse) => {


    var MIN_DIST = 100;
    var B_YES = DistanceMouse(Buttons.yes, mouse);
    var B_NO = DistanceMouse(Buttons.no, mouse);



    if (!Clicked) {
        let ProxButton = (B_YES < B_NO ? 'yes' : 'no');
        let ProxDistan = (B_YES < B_NO ? B_YES : B_NO);

        if (LastProxButton != ProxButton || ProxImage == "" || ImageView.style.opacity == 0) {
            let YES_IMAGE = INDEX_EVENTS.GET_RANDOM_IMAGE('yes');
            let NO_IMAGE = INDEX_EVENTS.GET_RANDOM_IMAGE('no');

            LastProxButton = ProxButton;
            ProxImage = (ProxButton == 'yes' ? YES_IMAGE : NO_IMAGE);
        }


        let OPACITY_P = 1 - (ProxDistan / MIN_DIST);
        let OPACITY_N = (ProxDistan / MIN_DIST);

        if (ProxDistan < MIN_DIST) {
            INDEX_EVENTS.CHARGE_IMAGE(ProxImage);
            ImageView.style.opacity = iclamp(OPACITY_P, 0, .85);

            switch (ProxButton) {
                case 'yes': {

                    let DOG = document.getElementById('image-dog')
                    DOG.style.animationDuration = `${iclamp((ProxDistan / MIN_DIST), .15, 1)}s`;

                    INDEX_EVENTS.RETURN_DEFAULT({
                        TYPE: 'SELECT',
                        LIST: ['#background-black', '.no-view']
                    })


                }; break;

                case 'no': {
                    BBackground.style.opacity = OPACITY_P;

                    document.querySelectorAll('.no-view').forEach((ELEMENT) => {
                        ELEMENT.style.opacity = OPACITY_N;
                    })
                }; break;
            }

            return
        }

        return INDEX_EVENTS.RETURN_DEFAULT();
    }

})