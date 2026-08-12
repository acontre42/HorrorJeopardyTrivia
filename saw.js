"use strict";
import Trivia from './categories/saw.json' with {type: "json"};
//import Trivia from './categories/saw2.json' with {type: "json"};
import {setUpBoard, removeSplashScreenTimer} from './board.js';

removeSplashScreenTimer(4600);
setUpBoard(Trivia, 'GAME OVER');