import * as React from "react";
import './Tree.css'
import EditableLeaf from "./EditableLeaf";


export interface Props {
    data?: {}

}

interface State {
    isDirty: boolean
}


const json = {
    "Beverages": [
        "Water",
        "Coffee",
        {
            "Tea": [
                "Black Tea",
                "White Tea",
                "Green Tea",
                {
                    "Sencha": [
                        "Gyokuro",
                        "Matcha",
                        "Pi Lo Chun"
                    ]
                }
            ]
        }
    ]
}


const json2 = {
    "Beverages": [
        "Water",
        "Coffee",
        {
            "Tea": [
                true,
                34534,
                "Green Tea",
                {
                    "Sencha": [
                        "Gyokuro",
                        "Matcha",
                        "Pi Lo Chun"
                    ]
                }
            ]
        }
    ]
}


const x = {
    "name": "blogger",
    "users": [
        ["admins", "1", "2", "3"],
        ["editors", "4", "5", "6"],
    ]
}

/*
       json object in
       1. loop object keys. DONE
       2. build node from key name. DONE
       3. get value from key: DONE
       4. if value is primative build leaf
       5. if value is object repeat step 1
       6. if value is array loop array
           6.1 if value is primative build leaf
           6.2 if value is object repeat 1
           6.3 if value is array repeat 6
 */


const xxx = {
    "imagePath": "./../images/",
    "appName": "Strength Pit Otara",
    "pages": [
        {
            "name": "Home",
            "path": "/",
            "template": "src/components/pages/Home"
        },
        {
            "name": "Merchandise",
            "template": "src/components/pages/Shop",
            "path": "merchandise"
        },
        {
            "name": "About",
            "path": "about",
            "template": "src/components/pages/About"
        },
        {
            "name": "Gallery",
            "path": "image-gallery",
            "template": "src/components/pages/ImageGallery",
            "FBAccessToken" : "EAADnfUDm9OcBAKIZAPjMZB9bb1JaQ35bsPOHkg1VjFcqGF3sNOMZCOWB5YJT8qMvvG3SXOdMcMZCZC8ZBm28AUQaYYhimDlg8Oe6ZAYwxXA5gzEpoDdfJPAlPBbJypNxvcoUsDTab5VYq4wjqwaR2ziL0c1vaDn2GyQRuH7PPEFaqa0oD6P3fA9yQMTFoiLsd2gSK9RTSE4FgZDZD"
        },
        {
            "name": "Videos",
            "path": "videos",
            "template": "src/components/pages/Videos"
        },
        {
            "name": "Page Nout Found",
            "path": "404",
            "template": "src/components/pages/404"
        },
        {
            "name": "Athletes",
            "path": "athletes",
            "template": "src/components/pages/Athletes",
            "sections": [
                {
                    "opener": {
                        "type": "tab",
                        "open": true
                    },
                    "header": "Pro Athletes",
                    "sections": [
                        {
                            "link": "https://www.facebook.com/Eddiejowilliams",
                            "image": {
                                "src": "eddie.jpeg"
                            },
                            "header": "Eddie Williams",
                            "list": [
                                "2 x Australia Strongest Man 18,19",
                                "WSM athlete",
                                "Pro Arnold Classic athlete"
                            ]
                        },
                        {
                            "image": {
                                "src": "trey_mitchell.png"
                            },
                            "header": "Trey Mitchell",
                            "list": [
                                "1 x America Strongest Man 2019",
                                "WSM athlete",
                                "Pro Arnold Classic athlete"
                            ]
                        },
                        {
                            "image": {
                                "src": "kate_mitchell.png"
                            },
                            "header": "Kate Mitchell",
                            "list": [
                                ""
                            ]
                        },
                        {
                            "image": {
                                "src": "shayna_wirihana.png"
                            },
                            "header": "Shayna Wirihana",
                            "list": [
                                ""
                            ]
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab"
                    },
                    "header": "Celebrities",
                    "sections": [
                        {
                            "image": {
                                "src": "david_tua.png"
                            },
                            "header": "David Tua",
                            "list": [
                                ""
                            ]
                        },
                        {
                            "image": {
                                "src": "dave_latele.png"
                            },
                            "header": "Dave Latele",
                            "list": [
                                ""
                            ]
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab"
                    },
                    "header": "VIP Memebers",
                    "sections": [
                        {
                            "image": {
                                "src": "george_grieg.png"
                            },
                            "header": "George Grieg"
                        },
                        {
                            "image": {
                                "src": "kenneth_auelua.png"
                            },
                            "header": "Kenneth Auelua"
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab"
                    },
                    "header": "Trained at Strength Pit",
                    "sections": [
                        {
                            "image": {
                                "src": "pauly_tahuri.png"
                            },
                            "header": "Pauly Tahuri"
                        },
                        {
                            "image": {
                                "src": "man.png"
                            },
                            "header": "Mike ( NEED IMAGE )"
                        },
                        {
                            "image": {
                                "src": "selena_hotere.png"
                            },
                            "header": "Selena Hotere"
                        },
                        {
                            "image": {
                                "src": "awhina_macleod.png"
                            },
                            "header": "Awhina Macleod"
                        },
                        {
                            "image": {
                                "src": "mona_nansen.png"
                            },
                            "header": "Mona Nansen"
                        },
                        {
                            "image": {
                                "src": "rangimaria_hetaraka.png"
                            },
                            "header": "Rangimaria Hetaraka"
                        },
                        {
                            "image": {
                                "src": "alina_manu.png"
                            },
                            "header": "Alina Manu"
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab"
                    },
                    "header": "Strong Kids",
                    "sections": [
                        {
                            "image": {
                                "src": "giavann_maxwell.png"
                            },
                            "header": "Giavann Maxwell"
                        },
                        {
                            "image": {
                                "src": "allekay_maxwell.png"
                            },
                            "header": "Allekay Maxwell"
                        },
                        {
                            "image": {
                                "src": "chaise.png"
                            },
                            "header": "Chaise"
                        },
                        {
                            "image": {
                                "src": "ty_waicokacola.png"
                            },
                            "header": "TY Waicokacola"
                        },
                        {
                            "image": {
                                "src": "zahra_waicokacola.png"
                            },
                            "header": "Zahra Waicokacola"
                        },
                        {
                            "image": {
                                "src": "ronin_da_barbarian.png"
                            },
                            "header": "Ronin Da Barbarian"
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "Open Mens",
                    "sections": [
                        {
                            "image": {
                                "src": "anthony_dillon.png"
                            },
                            "header": "Anthony Dillon",
                            "list": [
                                "NZ Mas Wrestling Open Mens Champion 2020",
                                "Backyard Highland Games Open Mens champion 2019",
                                "Auckland Highland Games 2019 2nd",
                                "Miada West Novice comp Open Mens 2019 2nd",
                                "Auckland Strongman Series round 3 2019 2nd"
                            ]
                        },
                        {
                            "image": {
                                "src": "nate_reed.png"
                            },
                            "header": "Nate Reed"
                        },
                        {
                            "image": {
                                "src": "bruce_fata_to_o.png"
                            },
                            "header": "Bruce Fata to’o"
                        },
                        {
                            "image": {
                                "src": "george_pikaahu.png"
                            },
                            "header": "George Pikaahu"
                        },
                        {
                            "image": {
                                "src": "nicholas_tiria.png"
                            },
                            "header": "Nicholas Tiria"
                        },
                        {
                            "image": {
                                "src": "ricki_saua.png"
                            },
                            "header": "Ricki Saua"
                        },
                        {
                            "image": {
                                "src": "ronnie_nansen.png"
                            },
                            "header": "Ronnie Nansen"
                        },
                        {
                            "image": {
                                "src": "rieken_bourne.png"
                            },
                            "header": "Rieken Bourne"
                        },
                        {
                            "image": {
                                "src": "quinn_matene.png"
                            },
                            "header": "Quinn Matene"
                        },
                        {
                            "image": {
                                "src": "dennis_peseta.png"
                            },
                            "header": "Dennis Peseta"
                        },
                        {
                            "image": {
                                "src": "christian_sio_open-mens.jpeg"
                            },
                            "header": "Christian Sio",
                            "list": [
                                "Miada West Novice comp 2019  1st",
                                "Auckland Highland Games 2019 3rd",
                                "Te Puke Strongest Man 2020 1st",
                                "Counties Strongest Man 2020 3rd",
                                "NZ Static Monsters Open Mens 2019 1st"
                            ]
                        },
                        {
                            "image": {
                                "src": "andrew_fraser.png"
                            },
                            "header": "Andrew Fraser"
                        },
                        {
                            "image": {
                                "src": "dan_sio_opens_men.png"
                            },
                            "header": "Dan Sio",
                            "list": [
                                "Counties Strongest Man 2020 4th",
                                "Miada West Novice comp 2019 4th"
                            ]
                        },
                        {
                            "image": {
                                "src": "isaac_elsmore.png"
                            },
                            "header": "Isaac Elsmore"
                        },
                        {
                            "image": {
                                "src": "erin_toma.png"
                            },
                            "header": "Erin Toma"
                        },
                        {
                            "image": {
                                "src": "hola_eleazar.png"
                            },
                            "header": "Hola Eleazar"
                        },
                        {
                            "image": {
                                "src": "male.png"
                            },
                            "header": "Male"
                        },
                        {
                            "image": {
                                "src": "iosefo_iosia.png"
                            },
                            "header": "Iosefo Iosia"
                        },
                        {
                            "image": {
                                "src": "fia_peni.png"
                            },
                            "header": "Fia Peni"
                        },
                        {
                            "image": {
                                "src": "zhan_matene.png"
                            },
                            "header": "Zhan Matene"
                        },
                        {
                            "image": {
                                "src": "tuatu_rapira_keil.png"
                            },
                            "header": "Tuatu Rapira-keil"
                        },
                        {
                            "image": {
                                "src": "jacob_sionepeni.png"
                            },
                            "header": "Jacob Sionepeni"
                        },
                        {
                            "image": {
                                "src": "joshua_fata_to_o.png"
                            },
                            "header": "Joshua Fata to’o"
                        },
                        {
                            "image": {
                                "src": "paulee_sosene.png"
                            },
                            "header": "Paulee Sosene"
                        },
                        {
                            "image": {
                                "src": "kingtee_alaifatu.png"
                            },
                            "header": "KingTee  Alaifatu"
                        },
                        {
                            "image": {
                                "src": "sio.png"
                            },
                            "header": "Sio"
                        },
                        {
                            "image": {
                                "src": "harris_tuaato.png"
                            },
                            "header": "Harris Tuaato"
                        },
                        {
                            "image": {
                                "src": "panapa_sadaraka.png"
                            },
                            "header": "Panapa Sadaraka"
                        },
                        {
                            "image": {
                                "src": "dawson_marama_feagai.png"
                            },
                            "header": "Dawson Marama-Feagai"
                        },
                        {
                            "image": {
                                "src": "anthony_taro_wirihana.png"
                            },
                            "header": " Anthony Taro Wirihana"
                        },
                        {
                            "image": {
                                "src": "eric_fuimaono_hunt.png"
                            },
                            "header": "Eric Fuimaono Hunt"
                        },
                        {
                            "image": {
                                "src": "ashley_lavin.png"
                            },
                            "header": " Ashley Lavin"
                        },
                        {
                            "image": {
                                "src": "vaughn_hannah_opens_men.png"
                            },
                            "header": "Vaughn Hannah",
                            "list": [
                                "2019 Auckland Strongman Series round 3 aopen Mens 3rd"
                            ]
                        },
                        {
                            "image": {
                                "src": "keitel_henry.png"
                            },
                            "header": "Keitel Henry"
                        },
                        {
                            "image": {
                                "src": "ned_houkamau.png"
                            },
                            "header": "Ned Houkamau"
                        },
                        {
                            "image": {
                                "src": "ash_westerlund.png"
                            },
                            "header": "Ash Westerlund",
                            "list": [
                                "Deadlifr 270kg PB",
                                "Squat 240kg PB",
                                "Bench 130kg PB"
                            ]
                        },
                        {
                            "image": {
                                "src": "jeremy_sullivan_opopen_mens.png"
                            },
                            "header": "Jeremy Sullivan",
                            "list": [
                                "2020 Miada West Novice comp Open Mens 4th"
                            ]
                        },
                        {
                            "image": {
                                "src": "eruera_wirihana.png"
                            },
                            "header": "Eruera Wirihana",
                            "list": [
                                "2 x Manuwatu Strongest Man 2018, 2019",
                                "Wellington Strongest Man 2019 2nd",
                                "Canterbury Strongest Man 2019 2nd"
                            ]
                        },
                        {
                            "image": {
                                "src": "jay_waicokacola.png"
                            },
                            "header": "Jay Waicokacola",
                            "list": [
                                "Central Coast Strongest Man 2019 Champion"
                            ]
                        },
                        {
                            "image": {
                                "src": "man.png",
                                "url": ""
                            },
                            "header": "Nick Turia",
                            "list": [
                                "2020 Miada West Novice comp  Open Mens 6th"
                            ]
                        },
                        {
                            "image": {
                                "src": "paul_mau.png"
                            },
                            "header": "Paul Mau",
                            "list": [
                                "2019 Miada West Novice comp  6th",
                                "Backyard Highland Games Open Mens 2019 2nd"
                            ]
                        },
                        {
                            "image": {
                                "src": "man.png",
                                "url": ""
                            },
                            "header": "Bobby Mateo",
                            "list": [
                                "Deadlift 230kg PB",
                                "Squat 180kg PB",
                                "Bench 130kg PB"
                            ]
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "U105kg Men",
                    "sections": [
                        {
                            "image": {
                                "src": "ben_bowden.png"
                            },
                            "header": "Ben Bowden",
                            "list": [
                                "Static Monsters u105kg 1st 2019",
                                "2nd Counties Strongest Man 2020",
                                "Te Puke Strongest Man 2020 2nd"
                            ]
                        },
                        {
                            "image": {
                                "src": "oliver_wilson.png"
                            },
                            "header": "Oliver Wilson",
                            "list": [
                                "1 x Counties Strongest Man u105kg 2020",
                                "NZ Strongman Series Nationals 3rd 2018"
                            ]
                        },
                        {
                            "image": {
                                "src": "kyp_kotzikas.png"
                            },
                            "header": "Kyp Kotzikas"
                        },
                        {
                            "image": {
                                "src": "man.png"
                            },
                            "header": "Jamaine Westerlund",
                            "list": [
                                "NZ Strongman Series Nationals 2019 - 2nd place"
                            ]
                        },
                        {
                            "image": {
                                "src": "duncan_davis.png"
                            },
                            "header": "Duncan Davis",
                            "list": [
                                "Static Monsters u105kg 2019 3rd",
                                "Miada West Novice comp 2019 3rd"
                            ]
                        },
                        {
                            "image": {
                                "src": "jamaine_westerlund.png"
                            },
                            "header": "Jamaine Westerlund"
                        },
                        {
                            "image": {
                                "src": "colin_sparey.png"
                            },
                            "header": "Colin Sparey"
                        },
                        {
                            "image": {
                                "src": "isaac_bell.png"
                            },
                            "header": "Isaac Bell"
                        },
                        {
                            "image": {
                                "src": "man.png"
                            },
                            "header": "Tangaroa Keepa Jackson",
                            "list": [
                                "Miada West Novice comp 2020 1st place",
                                "4th u105kg Backyard Highland Games 2019"
                            ]
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "U90kg Men",
                    "sections": [
                        {
                            "image": {
                                "src": "ryan_stowers.png"
                            },
                            "header": "Ryan Stowers",
                            "list": [
                                "Te Puke Strongest Man 2020 3rd",
                                "NZ Mas Wrestling u105kg Champion 2020"
                            ]
                        },
                        {
                            "image": {
                                "src": "dino_omicevic.png"
                            },
                            "header": "Dino Omicevic",
                            "list": [
                                "NZ Static Monsters 2019 u90kg",
                                "NZ Mas Wrestling u90kg Champion 2020"
                            ],
                            "link": "https://www.facebook.com/dino.omi"
                        },
                        {
                            "image": {
                                "src": "troy_moyle.png"
                            },
                            "header": "Troy Moyle",
                            "list": [
                                "2nd Miada West Novice comp u105 2019",
                                "Counties Strongest Man u90kg for 2020 "
                            ]
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "U80kg Men",
                    "sections": [
                        {
                            "image": {
                                "src": "jagdip_bajwa.png"
                            },
                            "header": "Jagdip Bajwa",
                            "list": [
                                "NZ Strongman Series Nationals Champion 1st place"
                            ]
                        },
                        {
                            "image": {
                                "src": "inderjit_singh.png"
                            },
                            "header": "Inderjit Singh",
                            "list": [
                                "NZ Strongman Series Nationals Champion 1st place"
                            ]
                        },

                        {
                            "image": {
                                "src": "skyler_hawk.png"
                            },
                            "header": "Skyler Hawk",
                            "list": [
                                "NZ Strongman Series Nationals u90kg 3rd.place"
                            ]
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "Open Ladies",
                    "sections": [
                        {
                            "image": {
                                "src": "man.png"
                            },
                            "header": "Shar Pini",
                            "list": [
                                "Arnold Classic competitor",
                                "2019 Arnold's Classic Mas Wrestling Open Ladies Champion",
                                "2020 Mas Wrestling Open Ladies champion "
                            ]
                        },
                        {
                            "image": {
                                "src": "man.png"
                            },
                            "header": "Krissy Bhen",
                            "list": [
                                "Auckland Strongman Series round 3 Open Ladies 2019 3rd",
                                "NZ Strongman Series Nationals Open Ladies 2019 2nd"
                            ]
                        },
                        {
                            "image": {
                                "src": "hosanna_mateo.png"
                            },
                            "header": "Hosanna Mateo",
                            "list": [
                                "Auckland Strongman Series round 3 Open Ladies 2018 3rd",
                                "King & Queen of Stones Open Ladies 2019 2nd"
                            ]
                        },
                        {
                            "image": {
                                "src": "kylie_clark.png"
                            },
                            "header": "Kylie Clark",
                            "list": [
                                "Auckland Strongman Series round 2 Open Ladies 2017 3rd",
                                "Auckland Strongman Series round 3 Open Ladies 2018 3rd"
                            ]
                        },
                        {
                            "image": {
                                "src": "sharlene_pini.png"
                            },
                            "header": "Sharlene Pini"
                        },
                        {
                            "image": {
                                "src": "nora_jonez.png"
                            },
                            "header": "Nora Jonez"
                        },
                        {
                            "image": {
                                "src": "jodie_pryor.png"
                            },
                            "header": "Jodie Pryor"
                        },
                        {
                            "image": {
                                "src": "bailey_norris.png"
                            },
                            "header": "Bailey Norris"
                        },
                        {
                            "image": {
                                "src": "anna_alder.png"
                            },
                            "header": "Anna Alder"
                        },
                        {
                            "image": {
                                "src": "kelly_flesher.png"
                            },
                            "header": "Kelly Flesher"
                        },
                        {
                            "image": {
                                "src": "karewa_hawkins.png"
                            },
                            "header": "Karewa Hawkins"
                        },
                        {
                            "image": {
                                "src": "amy_ferriss.png"
                            },
                            "header": " Amy Ferris"
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "U82kg Ladies",
                    "sections": [
                        {
                            "image": {
                                "src": "manuao_stowers.png"
                            },
                            "header": "Manuao Stowers",
                            "list": [
                                "NZ Strongman Series Nationals u82kg 2019 3rd",
                                "Auckland Strongman Series round 2 u72kg 2019 3rd"
                            ]
                        },
                        {
                            "image": {
                                "src": "u_tra_stowers.png"
                            },
                            "header": "Tu-Ira Stowers"
                        },
                        {
                            "image": {
                                "src": "casey_boxall.png"
                            },
                            "header": "Casey Boxall"
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "U73kg Ladies",
                    "sections": [
                        {
                            "image": {
                                "src": "kylie_vincent.png"
                            },
                            "header": "Kylie Vincent",
                            "list": [
                                "NZ Strongman Series Nationals u73kg Champion 2019",
                                "Auckland Strongman Series round 2 Champion 2019",
                                "Auckland Strongman Series round 3 Champion 2019",
                                "NZ Strongest Woman 2020 4th"
                            ]
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "U65kg Ladies",
                    "sections": [
                        {
                            "image": {
                                "src": "leehane_stowers.png"
                            },
                            "header": "Leehane Stowers",
                            "list": [
                                "Arnold Competitor",
                                "Auckland Highland Games u65kg Champion"
                            ]
                        },
                        {
                            "image": {
                                "src": "vendy_vespalcova.png"
                            },
                            "header": "Vendy Vespalcova"

                        }

                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "Masters Men",
                    "sections": [
                        {
                            "image": {
                                "src": "afaese_paea.png"
                            },
                            "header": "Afaese 'The Godfather' Paea",
                            "list": [
                                "4 x NZ Strongest Man Masters Champion 2016, 2017, 2018, 2019",
                                "1 x Southern Hemisphere  Strongest Man Masters Champion 2019",
                                "1 x NZ Southern Hemisphere Strongest Man Open Mens Champion 2018",
                                "1 x NZ Strongman Series Nationals Masters 2019 Champion",
                                "1 x Big Boys Toys Masters 2019 Champion",
                                "1 x Counties Strongest Man Masters 2020 Champion",
                                "8 x NZSM competitor"
                            ]
                        },
                        {
                            "image": {
                                "src": "ben_paea.png"
                            },
                            "header": "Ben 'The Tank' Paea",
                            "list": [
                                "2 x NZ Strongest Man Masters 2017, 2018 2nd",
                                "1 x NZ Strongest Man Masters 2019 3rd",
                                "NZ Strongman Series Nationals Masters 2019 3rd"
                            ]
                        },
                        {
                            "image": {
                                "src": "hex_kingi_masters.png"
                            },
                            "header": "Hex 'Uncle Hex' Kingi",
                            "list": [
                                "NZ Static Monsters Masters 2019 1st",
                                "Big Boys Toys Masters title 2020 2nd",
                                "Backyard Highland Games Masters 2019 2nd",
                                "NZ Strongest Man Masters 2019 4th"
                            ]
                        },
                        {
                            "image": {
                                "src": "Karlos_tua.png"
                            },
                            "header": "Karlos Tua",
                            "list": [
                                "1 x Australia Static Monster Masters Champion 2018"
                            ]
                        },
                        {
                            "image": {
                                "src": "joseph_apii_masters.png"
                            },
                            "header": "Joseph Apii",
                            "list": [
                                "Miada West Novice Masters 2020 2nd",
                                "NZ Static Monsters Masters 2019 3rd",
                                "NZ Strongest Man Masters 2019 4th",
                                "NZ Strongman Series Nationals Masters 2019 4th"
                            ]
                        },
                        {
                            "image": {
                                "src": "whetu_flesher.png"
                            },
                            "header": "Whetu Flesher"
                        },
                        {
                            "image": {
                                "src": "clem_fortes.png"
                            },
                            "header": "Clem Fortes"
                        },
                        {
                            "image": {
                                "src": "man.png"
                            },
                            "header": "Whetu Flesher",
                            "list": [
                                "2 x NZ Strongest Man Masters 2016, 2017",
                                "2017 NZ Static Monsters u105kg Champion",
                                "2 x NZSM competitor"
                            ]
                        },
                        {
                            "image": {
                                "src": "rich_farrell.png"
                            },
                            "header": "Rich Farrell",
                            "list": [
                                "2 x NZ Strongest Man Masters u105 2019, 2020",
                                "Te Puke Strongest Man u105kg  1st",
                                "NZ Static Monsters Masters 2019 2nd"
                            ]
                        },
                        {
                            "image": {
                                "src": "nickgray.png"
                            },
                            "header": "Nick Gray",
                            "list": [
                                "220kg Deadlift PB",
                                "100kg Bench PB",
                                "60kg Overhead Press PB",
                                "34kg Single Arm Overhead Press PB"
                            ]
                        },
                        {
                            "image": {
                                "src": "charlie_panapa.png"
                            },
                            "header": "Charlie Panapa"
                        },
                        {
                            "image": {
                                "src": "faapo.png"
                            },
                            "header": "Faapo"
                        },
                        {
                            "image": {
                                "src": "nick_fegan.png"
                            },
                            "header": "Nick Fegan"
                        },
                        {
                            "image": {
                                "src": "chris_bigdog_bellette.png"
                            },
                            "header": "Chris bigdog Bellette"
                        },
                        {
                            "image": {
                                "src": "hoani_macfarter.png"
                            },
                            "header": "Hoani Macfarter"
                        },
                        {
                            "image": {
                                "src": "tim_gray.png"
                            },
                            "header": "Tim Gray"
                        }
                    ]
                },
                {
                    "opener": {
                        "type": "tab",
                        "open": false
                    },
                    "header": "Masters Woman",
                    "body": "coming soon!!"
                }
            ]
        },
        {
            "name": "News",
            "path": "news",
            "template": "src/components/pages/StrongManNews",
            "sections": [
                {
                    "link": "https://facebook.com/events/s/new-zealand-strongman-series-n/250416402951612",
                    "header": "New Zealand Strongman Series Nationals 2020"

                }, {
                    "link": "https://facebook.com/events/s/aucklands-strongest-man-woman-/2859368420843627/",
                    "header": "Auckland's Strongest Man & Woman 2020"

                }]

        },
        {
            "name": "Sponsors",
            "path": "sponsors",
            "template": "src/components/pages/Sponsors",
            "images": [
                {
                    "src": "husk_and_stone.png",
                    "url": "#"
                },
                {
                    "src": "strenth_gear.jpg",
                    "url": "https://strengthgear.co.nz"
                },

                {
                    "src": "tumunu_sunglasses.fw_.png",
                    "url": "https://www.tumunusunglasses.co.nz"
                },
                {
                    "src": "ttt_logotrans.fw_.png",
                    "Name": "Paul",
                    "email": "paul@ttt.co.nz",
                    "phone": "+64 22 06 75 44"
                },
                {
                    "src": "benjimimgoldlogo.fw_.png",
                    "url": "https://www.benjaminblack.co.nz"
                },
                {
                    "src": "aucklandhealthperf.fw_.png",
                    "url": "https://www.ahap.co.nz"
                },
                {
                    "src": "jacksmeat.fw_.png",
                    "url": ""
                }
            ]
        },

        {
            "name": "Checkout",
            "path": "checkout",
            "template": "src/components/pages/Checkout"
        }
    ],
    "products": [
        {
            "type": "dummy",
            "title": "dummy prod",
            "description": "Adummy",
            "price": 1,
            "image": "strength_pit_black_training_tshirt.jpg",
            "variations": []

        },  {
            "type": "TSHIRT",
            "title": "Training Tee",
            "description": "AS Colors - Staple",
            "price": 25,
            "image": "strength_pit_black_training_tshirt.jpg",
            "variations": [
                {
                    "title": "Size",
                    "item": [
                        {
                            "optionValue": "Pick 1..."
                        },
                        {
                            "optionValue": "Small"
                        },
                        {
                            "optionValue": "Medium"
                        },
                        {
                            "optionValue": "Large"
                        },
                        {
                            "optionValue": "XL"
                        },
                        {
                            "optionValue": "2XL"
                        },
                        {
                            "optionValue": "3XL"
                        },
                        {
                            "optionValue": "4XL"
                        },
                        {
                            "optionValue": "5XL"
                        },
                        {
                            "optionValue": "6XL"
                        }
                    ]
                }
            ]
        },
        {
            "type": "TSHIRT",
            "title": "Dress tshirt",
            "description": "AS Colors - Staple",
            "price": 35,
            "image": "strength_pit_white_tshirt.png",
            "variations": [
                {
                    "title": "Size",
                    "item": [
                        {
                            "optionValue": "Pick 1..."
                        },
                        {
                            "optionValue": "Small"
                        },
                        {
                            "optionValue": "Medium"
                        },
                        {
                            "optionValue": "Large"
                        },
                        {
                            "optionValue": "XL"
                        },
                        {
                            "optionValue": "2XL"
                        },
                        {
                            "optionValue": "3XL"
                        },
                        {
                            "optionValue": "4XL"
                        },
                        {
                            "optionValue": "5XL"
                        },
                        {
                            "optionValue": "6XL"
                        }
                    ]
                },
                {
                    "title": "Color",
                    "item": [
                        {
                            "optionValue": "Pick 1...",
                            "image": "strength_pit_black_tshirt.jpg"
                        },
                        {
                            "optionValue": "Black",
                            "image": "strength_pit_black_tshirt.jpg"
                        },
                        {
                            "optionValue": "Red",
                            "image": "strength_pit_red_tshirt.png"
                        },
                        {
                            "optionValue": "White",
                            "image": "strength_pit_white_tshirt.png"
                        },
                        {
                            "optionValue": "Navy",
                            "image": "strength_pit_navy_tshirt.png"
                        },
                        {
                            "optionValue": "Chacoal",
                            "image": "strength_pit_charcoal_tshirt.png"
                        }
                    ]
                }
            ]
        },
        {
            "type": "Gold-Sovereeign-Rings",
            "title": "Gold Sovereeign Rings",
            "description": "<strong> (Reserved for Pit Members Only) </strong>Custom branded sovereign and half sovereign signet rings for Strength Pit Otara.",
            "image": "gold-ring.png",
            "variations": [
                {
                    "title": "Sovereeign",
                    "item": [
                        {
                            "optionValue": "Pick 1...",
                            "price": -1
                        },
                        {
                            "optionValue": "9 carat Full Sovereeign",
                            "price": 2795
                        },
                        {
                            "optionValue": "9 carat Half Sovereeign",
                            "price": 2395
                        }
                    ]
                }
            ]
        },
        {
            "type": "Sterling Silver RINGS",
            "title": "Sterling Silver RINGS",
            "description": "A truly special piece with jewellery and fragrance combined, we introduce you - Scented Jewellery. An inspiring and unique gift or a piece to own for yourself, this innovative accessory offers you both perfume and jewellery in one product - a true girl’s best friend!<br /><br />Each scented <b>jewellery</b> comes with a 3 month supply of scented stone that slowly diffuse the fragrance of your choice and allows the perfume to slowly release into the air around you. A new and clever way of wearing your perfume!",
            "image": "silver-ring3.png",
            "variations": [
                {
                    "title": "Sovereeign",
                    "item": [
                        {
                            "optionValue": "Pick 1...",
                            "price": -1
                        },
                        {
                            "optionValue": "Full Sovereeign",
                            "price": 295
                        },
                        {
                            "optionValue": "Half Sovereeign",
                            "price": 245
                        }
                    ]
                }
            ]
        },
        {
            "type": "Gold / Sterling Silver RINGS",
            "title": "1/2 Gold & Sterling Silver RINGS",
            "description": "A truly special piece with jewellery and fragrance combined, we introduce you - Scented Jewellery. An inspiring and unique gift or a piece to own for yourself, this innovative accessory offers you both perfume and jewellery in one product - a true girl’s best friend!<br /><br />Each scented <b>jewellery</b> comes with a 3 month supply of scented stone that slowly diffuse the fragrance of your choice and allows the perfume to slowly release into the air around you. A new and clever way of wearing your perfume!",
            "image": "gold-ring.png",
            "variations": [
                {
                    "title": "Sovereeign",
                    "item": [
                        {
                            "optionValue": "Pick 1...",
                            "price": -1
                        },
                        {
                            "optionValue": "Full Sovereeign",
                            "price": 1595
                        },
                        {
                            "optionValue": "Half Sovereeign",
                            "price": 1295
                        }
                    ]
                }
            ]
        }
    ]
}



class Tree extends React.Component<Props, State> {

    constructor(props) {
        super(props);
    }

    processObject = (object) =>
        Object.keys(object).map((key, reactKey) => {
            return (
                <li key={reactKey + key}>
                    {this.buildNode(key)}
                    <ul className="nested active">
                        {this.isPrimative(object[key]) ? this.buildLeaf(object[key]) :
                            this.isArray(object[key]) ? this.loopArray(object[key]) : this.startProObject(object[key], false)}
                    </ul>
                </li>
            )
        })

    startProObject = (object, parentIsArray) => {
        return parentIsArray  ? <li>  {this.buildNode('opener')}
          <ul className="nested active">
              {this.processObject(object)}
          </ul></li> : this.processObject(object)
        }

    loopArray = (array) =>
        array.map((value, key) =>
            <div key={key + value}>
                {this.isPrimative(value) ? this.buildLeaf(value) :
                    this.isArray(value) ? this.loopArray(value) : this.startProObject(value, true)}
            </div>
        )

    isArray = (value) =>
        Array.isArray(value)

    isPrimative = (value) => {
        return typeof (value) === 'string'
            || typeof (value) === 'number'
            || typeof (value) === 'boolean'
    }

    buildNode = (key: string) =>
        <span className="node"
              onClick={
                  (e) => {
                      this.toggle(e)
                  }}>
             {key}
            </span>

    buildLeaf = (value: string) =>
        <EditableLeaf isEditMode={true}
                      value={value} />
        /*<li className="leaf"
            onClick={
                (e) => {

                }}>
            {value}
        </li>*/

    toggle = (event) => {
        event.target.parentElement.querySelector(".nested").classList.toggle("active");
        event.target.classList.toggle("node-down");
    }

    render = () => <>
        <ul id="myUL">
            {this.processObject(xxx)}
        </ul>
    </>
}

export default Tree;
